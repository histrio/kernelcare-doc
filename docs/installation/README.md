# Installation of KernelCare

:::warning Note
BETA version of KernelCare with KC+ functionality is available as [rpm](https://patches04.kernelcare.com/userspace/kernelcare-2.32-1.el7.1595920539.56067.28.x86_64.rpm) and [deb](https://patches04.kernelcare.com/userspace/kernelcare_2.32-1.1599206356.56067.32_amd64.deb) package.
:::

KernelCare is compatible with 64-bit versions of CloudLinuxOS/CentOS/RHEL 6,7 and 8, Oracle Linux 6 and 7, Amazon Linux 1 and 2, Virtuozzo/PCS/OpenVZ 2.6.32, Debian 8,9 and 10, Proxmox VE 5 and 6, Virt-SIG/Xen4CentOS 6 and 7, Ubuntu 14.04, 15.04 and 16.04 kernels. The list of compatible kernels can be found on the following link: [https://patches.kernelcare.com/](http://patches04.kernelcare.com/userspace/kernelcare_2.32-1.1599206356.56067.32_amd64.deb) .

To install KernelCare run:

```
curl -s -L https://kernelcare.com/installer | bash
```

or:

```
wget -qq -O - https://kernelcare.com/installer | bash
```

If you are using IP-based license, nothing else required to be done.

If you are using key-based license, run:

```
$ /usr/bin/kcarectl --register KEY
```

`KEY` is the registration key code string provided when you sign up for purchase or trial of the product.

If you are experiencing **_Key limit reached_** error after the end of the trial period you should first unregister the server by running:

```
kcarectl --unregister
```

To check if patches applied run:

```
$ /usr/bin/kcarectl --info
```

The software will automatically check for new patches every 4 hours.

If you would like to run update manually:

```
$ /usr/bin/kcarectl --update
```

To check current kernel compatibility with KernelCare, use the following [script](https://raw.githubusercontent.com/iseletsk/kernelchecker/master/py/kc-compat.py) by running:

```
curl -s -L https://kernelcare.com/checker | python
```

or:

```
wget -qq -O - https://kernelcare.com/checker | python
```

More information can be found on the link: [https://www.kernelcare.com/faq/](https://www.kernelcare.com/faq/)

## Switching from Ksplice


To switch from Ksplice to KernelCare,  use the following script, which uninstalls Ksplice and installs KernelCare itself instead.

It will automatically detect and abort if the system is not 64-bit (as KernelCare doesn't support that).

It will also detects when Ksplice module cannot be uninstalled, and retries multiple times.

Download the script here: [https://patches.kernelcare.com/ksplice2kcare](https://patches.kernelcare.com/ksplice2kcare) .

Run the command:

```
$ bash ksplice2kcare $KERNELCARE_KEY$
```

The key can be created/retrieved in KernelCare Keys section of CLN.

If you want to use IP based licenses, run:

```
$ bash ksplice2kcare IP
```

You have to add IP license for that server, and it is just two letters: IP, not the actual IP.

By default the script will attempt 3 times to uninstall ksplice, waiting 60 seconds in between. You can run it using `nohup` if you don't want to wait.

You can change that by editing the script and changing `RETRY` and `SLEEP` values.

The script will exit with exit code `0` and message _Done_ on success. Otherwise, it will produce exit code `-1`.

Complete log file can be found at `/var/log/ksplice2kcare.log`.

<Disqus/>
