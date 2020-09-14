# Scanner Interface

## Issue description

Commonly used security scanners can still see CVEs even if they are patched by KernelCare. It turns out that all their decisions about CVE are based on:

* currently installed (or not) kernel packages
* `uname` information

## How does it work

The main idea of the scanner interface is to convince a security scanner that the kernel is up to date. To calm scanners down, we have to manipulate information and interfere with data that scanners gather. All scanner interface's features are based on one `ld.so` environment variable - [LD_PRELOAD](https://man7.org/linux/man-pages/man8/ld.so.8.html#ENVIRONMENT). We are overring some functions with our `kcare_package.so` and when any process that has that shared library in its LD_PRELOAD will use our functions and we gain control of what process will get.

The reloaded functions rely on `kcarectl --uname` and replace the actual kernel version with our “effective version”.
That behavior is enabled only for one user and will not interfere with others. That user should be used to run a credentialed scan over SSH.

### Modify the `uname` output

Relying on `uname -r` output is the common part for DEB and RPM distributions of many security scanners. The principle is simple: compare the output with the required kernel version. Handling this case is simple too: we need to overwrite [`uname`](https://man7.org/linux/man-pages/man2/uname.2.html) function. In the wrapper we are replacing `utsname->release` with our *effective version*.

``` bash
$ uname -r
3.10.0-693.17.1.el7.x86_64
$ LD_PRELOAD=/usr/libexec/kcare/kpatch_package.so uname -r
3.10.0-957.21.3.el7.x86_64
```

### Modify `rpm -q` output

Since scanners on RPM distributions relies on `rpm -q` output, we can override some [`rpm`](https://man8.org/linux/man-pages/man8/rpm.8.html) functions. To deal with it, we will reload `showQueryPackage` to patch version information on the fly. If `RPMTAG_NAME` of the package passed to that function is one of those that we are interested in, `RPMTAG_VERSION` will be overwritten with our *effective version*.

Affected packages:

* kernel
* kernel-headers
* kernel-devel
* kernel-tools
* kernel-tools-libs
* kernel-firmware
* python-perf

It will change the information showing in rpm query results like this.

``` bash
$ rpm -q kernel-headers
kernel-headers-3.10.0-693.17.1.el7.x86_64
$ LD_PRELOAD=/usr/libexec/kcare/kpatch_package.so rpm -q
kernel-headers-3.10.0-957.21.3.el7.x86_64
```

### Modify `dpkg -l` output

As like as for RPM case we need to modify the DEB package management output. But there is no easy way to do so. Each time when a package manager tries to find out which version of the package is installed it uses the content of `/var/lib/dpkg/status` file. So we have to overwrite [`open`](https://man7.org/linux/man-pages/man2/open.2.html) and modify the file's content on the fly.

Afftected packages:

* linux-image-generic
* linux-modules-.*-aws
* linux-headers-.*-aws
* linux-image-.*-aws

It will change the information showing in dpkg query results like this.

``` bash
$ dpkg -l | grep linux-image-generic
ii  linux-image-generic                    4.15.0-44.47                                  amd64        Generic Linux kernel image
$ LD_PRELOAD=/usr/libexec/kcare/kpatch_package.so dpkg -l | grep linux-image-generic
ii  linux-image-generic                    4.15.0-112.113                                  amd64        Generic Linux kernel image
```

### Modifying nested processes environment variables

Some agent-based scanners spawn processes with a custom environment and overwrite LD_PRELOAD. That will disable our wrappers and to avoid that we need to extend the variable each time it modifying via [`setenv`](https://man7.org/linux/man-pages/man3/setenv.3.html) overwriting. Each call of `setenv(LD_PRELOAD, 'something')` turns into `setenv(LD_PRELOAD, 'something kpatch_package.so')`

## Installation

There is a `kcare-scanner-interface` script provided with a kernelcare package. It's a tool for enabling and disabling scanner-interface wrappers.

``` bash
$ kcare-scanner-user init <scanner-user>
Setuping scanner for <scanner-user>
Done.
```

To be able to enable that functionality during package install env var `KCARE_SCANNER_USER` can be used:

``` bash
$ curl -s -L https://kernelcare.com/installer | KCARE_SCANNER_USER=username bash
```

Where `username` is the user that will be used to run scanners on the server.

:::tip Note
To see results, you should re-login to the server with `KCARE_SCANNER_USER` defined above and restart all scanner's agents.
:::

:::danger Warning
Using `root` or `any` as a scanner user is not recommended due to vague influence on the system's stability and performance because in this case, an overwhelming amount of processes will use overridden functions.
:::

After applying KernelCare patches (`kcarectl --update`) you will see that the output of package managers will be changed according to a kernel that the patches are provided.

:::danger Warning
_username_ should be equal to the user name that is used by the security scanner to log in to the system. KernelCare agent should be installed with `KCARE_SCANNER_USER` defined for Scanner Interface to operate properly (setting the variable at the run time is not enough).
:::

## How to use

It’s rather simple. New scan results after installing a package and applying a patchset should not show any kernel CVEs that are handled by KernelCare.

For example, Nessus for an old kernel shows a bunch of detected CVEs

![scanner-manipulation-before](/images/scanner-manipulation-before.png)

After patches were applied, there are no kernel-related CVEs

![scanner-manipulation-after](/images/scanner-manipulation-after.png)

## Uninstall

All enabled wrappers will be disabled while kernelcare package uninstallation or with a command:

``` bash
$ kcare-scanner-user disable
Done
```

## Troubleshooting

Checking whether `LD_PRELOAD` is properly defined for the local security scanner agent (we use Qualys for this example).

* Obtain the scanner agent PID:

``` bash
$ ps -aux | grep qualys
root       73869  0.1  0.9 299888  9844 pts/1    Ssl+ 06:57   0:00 /usr/local/qualys/cloud-agent/bin/qualys-cloud-agent
```

* The output for the PID obtained above should contain LD_PRELOAD:

``` bash
$ cat /proc/PID/environ
...LD_PRELOAD=/usr/libexec/kcare/kpatch_package.so...
```

:::tip Note
Qualys scanner agent is usually run as _root_, so make sure KernelCare agent is installed with KCARE_SCANNER_USER=root
:::

<Disqus/>

