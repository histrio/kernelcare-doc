# Uninstall KernelCare


To uninstall KernelCare do the the following:

_For CloudLinux, CentOS, RHEL, Virtuozzo, OpenVZ:_

```
$ yum remove kernelcare
```

_For Ubuntu, Debian, Proxmox VE:_

```
apt-get remove kernelcare
```
```
dpkg --remove kernelcare
```

This will also unlink the system from its activation key (provided there is network connectivity to the CLN Portal). However, you'll need to remove the license from the CLN Portal manually if you don't plan to use the service anymore.



