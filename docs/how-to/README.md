# How To

## How to disable HyperThreading (SMT) without reboot: KernelCare case

This article explains how to disable or enable SMT (Simultaneous multithreading) without rebooting using KernelCare, to help mitigate the recent MDS/Zombieload vulnerability.

Disabling CPU simultaneous multithreading (SMT) is one of the mitigations needed to counter the recent MDS vulnerability (also known as ‘Zombieload’). There is a performance impact that depends on the configuration of the hosting platform and its workload patterns. You should also consider the impact of other mitigation strategies, such as assigning dedicated cores to guests (e.g. VMs).

You can control and get the status of SMT with the kernel’s `sysfs` interface. There are two files, both in the `/sys/devices/system/cpu/smt` directory:

* `control`
* `active`


If you cannot find the `/sys/devices/system/cpu/smt` directory, this means your running kernel does not support SMT. In this case, you need to apply KernelCare patches so the SMT controls become available to your system. Use the `kcarectrl` command:

```
kcarectl --update
Kernel is safe
```

```
ls -l /sys/devices/system/cpu/smt
-r--r--r-- 1 root root 4096 May 17 13:06 active
-rw-r--r-- 1 root root 4096 May 17 13:06 control
```

As soon as you have these files in place, it is possible to proceed with disabling SMT.


<iframe width="560" height="315" src="https://www.youtube.com/embed/RUGCvEO1hAE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### SMT Control

`/sys/devices/system/cpu/smt/control`

This file lets you enable or disable SMT, and shows its state. There are three values:

1. `on`: The CPU supports SMT and it is enabled. All logical CPUs can be taken offline or online without restriction.
2. `off`: The CPU supports SMT but it is disabled. Only so-called primary SMT threads can be taken offline/online without restriction. Attempts to put a non-primary sibling thread online will be rejected.
3. `notsupported`: The CPU does not support SMT. You will not be able to write to the control file.

### SMT Status

`/sys/devices/system/cpu/smt/active`

The contents of this file show the status of SMT (e.g. if two or more sibling threads are active on the same physical core the contents of this file is 1, if not: 0).

Here are some commands to control SMT support (root permissions are required):

#### Check the SMT state

```
cat /sys/devices/system/cpu/smt/active
```

#### Enable SMT

```
echo on > /sys/devices/system/cpu/smt/control
```

#### Disable SMT

```
echo off > /sys/devices/system/cpu/smt/control
```

Disabling SMT, [updating microcode](/how-to/#how-to-update-microcode-without-reboot-with-vendor-provided-package), and applying KernelCare patches will protect your systems against the ZombieLoad vulnerability. Note, only the latter action is applicable to virtual systems (e.g. VMs, VPS and other cloud instance types).

## How to update Microcode without reboot with vendor-provided package

This article shows how to update the microcode of Intel CPUs running Linux.

:::warning Warning
To avoid possible issues with Microcode updating, enable SMT before the update.
:::


::: tip Note
This article is subject to change and will be updated with instructions for other distributions.
:::

**Contents:**

* [Updating microcode on Ubuntu and Debian](/how-to/#updating-microcode-on-ubuntu-and-debian)
* [Updating microcode on Red Hat Enterprise Linux (and derivatives)](/how-to/#updating-microcode-on-red-hat-and-centos)
* [Updating Microcode on CentOS 6](/how-to/#updating-microcode-on-centos-6)


::: tip Notes
* These steps must be done as root.
* The examples shown are for Debian.
* If you have doubts your systems are fully protected against CPU- and kernel-related vulnerabilities, please [get in touch with us](mailto:sales@cloudlinux.com).
:::

### Updating microcode on Ubuntu and Debian

1. Find the microcode package download link for your platform
   
    * Ubuntu: [https://usn.ubuntu.com/3977-1/](https://usn.ubuntu.com/3977-1/)
    * Debian: [https://packages.debian.org/search?keywords=intel-microcode](https://packages.debian.org/search?keywords=intel-microcode)
  
2. Download the package

:::tip Note
Example shown for Debian 9
:::

```
cd <a temporary directory, e.g. /tmp>
mkdir firmware
cd firmware
wget http://security.debian.org/debian-security/pool/updates/non-free/i/intel-microcode/intel-microcode_3.20190514.1~deb9u1_amd64.deb
```

3. Check the downloaded package

```
md5sum intel-microcode_3.20190514.1~deb9u1_amd64.deb
c7bc9728634137453e0f4821fb6bb436  intel-microcode_3.20190514.1~deb9u1_amd64.deb
```

A list of checksums is on [the Debian packages download page](https://packages.debian.org/stretch/amd64/intel-microcode/download).

4. Unpack the package

```
dpkg -x intel-microcode_3.20190514.1~deb9u1_amd64.deb
```

5. Check the unpacked files

```
ls -l
total 1896
drwxr-xr-x 5 root root   53 May 15 04:18 etc
-rw-r--r-- 1 root root 1940140 May 17 11:42 intel-microcode_3.20190514.1~deb9u1_amd64.deb
drwxr-xr-x 3 root root   22 May 15 04:18 lib
drwxr-xr-x 3 root root   19 May 15 04:18 usr
```
6. Create a backup of existing microcode:

```
test -d /lib/firmware/intel-ucode/ && mv /lib/firmware/intel-ucode/ /lib/firmware/intel-ucode.backup
```

7. Copy the new microcode and check it

```
cp -r lib/firmware/intel-ucode/ /lib/firmware/
ls -l /lib/firmware/ | grep intel-ucode
drwxr-xr-x  2 root root 4096 May 17 11:47 intel-ucode
drwxr-xr-x  2 root root 4096 May 16 20:54 intel-ucode.backup
```

8. Check the current microcode version

```
dmesg | grep microcode
[ 2.254717] microcode: sig=0x306a9, pf=0x10, revision=0x12
[ 2.254820] microcode: Microcode Update Driver: v2.01 <tigran@aivazian.fsnet.co.uk>, Peter Oruba
```

9. (Optional) Double check the current microcode versions (revisions per core)

```
cat /proc/cpuinfo | grep -e microcode
microcode : 0x12
microcode : 0x12
microcode : 0x12
microcode : 0x12
```

10. Check the microcode reload file exists

```
ls -l /sys/devices/system/cpu/microcode/reload
--w------- 1 root root 4096 May 17 11:54 /sys/devices/system/cpu/microcode/reload
```

11. Force the kernel to load the new microcode

```
echo 1 > /sys/devices/system/cpu/microcode/reload
```

12. Check the new microcode

```
dmesg | grep microcode
[ 2.254717] microcode: sig=0x306a9, pf=0x10, revision=0x12
[ 2.254820] microcode: Microcode Update Driver: v2.01 <tigran@aivazian.fsnet.co.uk>, Peter Oruba
[ 1483.494573] platform microcode: firmware: direct-loading firmware intel-ucode/06-3a-09
[ 1483.495985] microcode: updated to revision 0x21, date = 2019-02-13
[ 1483.496012] platform microcode: firmware: direct-loading firmware intel-ucode/06-3a-09
[ 1483.496698] platform microcode: firmware: direct-loading firmware intel-ucode/06-3a-09
[ 1483.497391] platform microcode: firmware: direct-loading firmware intel-ucode/06-3a-09
```

13. (Optional) Double check the new microcode version (revisions per core)

```
cat /proc/cpuinfo | grep -e microcode
microcode : 0x21
microcode : 0x21
microcode : 0x21
microcode : 0x21
```

### Updating Microcode on Red Hat and CentOS

For RHEL-based distributions, you can use the `microcode_ctl utility` to update microcode.

1. Get the latest microcode by updating the `microcode_ctl` package

```
yum update microcode_ctl
```

2. Create a force file

Create a `force-late-intel–06–4f–01` inside the firmware directory.

```
touch /lib/firmware/`uname -r`/force-late-intel-06-4f-01
```

3. Run the microcode update

```
/usr/libexec/microcode_ctl/update_ucode
```

4. Force the kernel to load the new microcode

```
echo 1 > /sys/devices/system/cpu/microcode/reload
```

5. Check the new microcode

```
dmesg | grep microcode
[ 2.254717] microcode: sig=0x306a9, pf=0x10, revision=0x12
[ 2.254820] microcode: Microcode Update Driver: v2.01 <tigran@aivazian.fsnet.co.uk>, Peter Oruba
[ 1483.494573] platform microcode: firmware: direct-loading firmware intel-ucode/06-3a-09
[ 1483.495985] microcode: updated to revision 0x21, date = 2019-02-13
[ 1483.496012] platform microcode: firmware: direct-loading firmware intel-ucode/06-3a-09
[ 1483.496698] platform microcode: firmware: direct-loading firmware intel-ucode/06-3a-09
[ 1483.497391] platform microcode: firmware: direct-loading firmware intel-ucode/06-3a-09
```

6. (Optional) Double check the new microcode version (revisions per core)

```
cat /proc/cpuinfo | grep -e microcode
microcode : 0x21
microcode : 0x21
microcode : 0x21
microcode : 0x21
```

### Updating Microcode on CentOS 6

1. Get the latest microcode by updating the `microcode_ctl` package

```
yum update microcode_ctl
```

2. If `yum update microcode_ctl` outputs the following:

```   
Package(s) microcode_ctl available, but not installed.
No Packages marked for Update
```

you need to install the package manually.

3. To install `microcode_ctl` package, run the command:

```
yum install microcode_ctl
```

The command output:

```
Installed:
  microcode_ctl.x86_64 2:1.17-33.11.el6_10                                                                                                                                 

Complete!
```

4. Check CPU microcode version:

```
cat /proc/cpuinfo | grep microcode
microcode       : 9
microcode       : 9
microcode       : 9
microcode       : 9
```

5. Try to update microcode

```
microcode_ctl -u
```

If you see the output:

```
microcode_ctl: writing microcode (length: 2370560)
microcode_ctl: cannot open /dev/cpu/microcode for writing errno=2 (No such file or directory)
```

You need to load driver microcode.

6. Load driver microcode

```
modprobe microcode
```

7. Try to update microcode again:

```
microcode_ctl -u
```
If you see the output: 

```
microcode_ctl: writing microcode (length: 2370560)
microcode_ctl: microcode successfully written to /dev/cpu/microcode
```
then update is successful.

8. Check version:

```
cat /proc/cpuinfo | grep microcode
microcode       : 17
microcode       : 17
microcode       : 17
microcode       : 17
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/EydWy-b9uns" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Plesk related

### How to get a KernelCare activation key from the extended Plesk license

Often our clients purchase KernelCare licenses through Plesk/Odin and in such cases, they get a universal key which includes the KernelCare license and other additional keys for Plesk plugins. Such a key has the following syntax – `A00B00-0CDE00-F0G000-HIGK00-LM0N00`, – and initially, it is installed through Plesk automatically and the license gets activated successfully.

However, if it is required to re-register the agent for some reason or simply get the KernelCare activation key separately, it would be impossible to apply the above-mentioned one – we would need to deal with the KernelCare service separately. 

To get the KernelCare activation key from the extended Plesk license key, you will need to proceed with the following.

1. Navigate to _Tools & Settings >> Plesk >> License Management >> Additional License Keys_

  ![](/images/LicenseManagement.png)

  ![](/images/AdditionalLicenseKeys.png)

2. Click _Download key_ next to the KernelCare license listed on the page and open the file downloaded in some text editor

3. Find the following abstract:

  ```
  <!--Key body-->
  <aps-3:key-body core:encoding="base64" core:type="binary">YOUR_BASE64_ENCODED_LICENSE_KEY==</aps-3:key-body>
  <!--Information about additional key-->
  ```

4. This is your base64-encoded key, and it should be decoded using a CLI utility or an online base64 decoder into UTF-8, e.g. [https://www.base64decode.org](https://www.base64decode.org). 
The new license key should have the following format: `xxxxxxxxxxxxxxxx`. It will contain lower and upper case letters and numbers.

5. Use the new key decoded to activate the service:

  ```
  /usr/bin/kcarectl --register DECODED_KEY_HERE
  ```

This is it!

