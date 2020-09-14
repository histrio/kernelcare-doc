# Firewall and Proxy Settings


## Patching servers through firewall
 
As long as your servers have access to the Internet, even behind NAT —  you will be able to use KernelCare patch server without any problems.

Generally, KernelCare requires connection to only two servers for a proper work:

```
cln.cloudlinux.com
patches.kernelcare.com
```

An additional address is used for KernelCare agent installation/update:

```
repo.cloudlinux.com
```

![](/images/patchingthroughfirewall.png)

## Patching servers through proxy

 
If your servers don't have direct Internet access but can gain access to the Internet using proxy, the configuration is not that different. KernelCare can pick up standard environment variables for a proxy.

Make sure you have environment settings for proxy setup, and everything else will be the same as if servers were directly connected to the Internet:

```
# export http_proxy=http://proxy.domain.com:port
# export https_proxy=http://proxy.domain.com:port
```

:::tip Note
Settings defined by `export` are case-insensitive, so the example above could be as follows:
:::

```
# export HTTP_PROXY=http://proxy.domain.com:port
# export HTTPS_PROXY=http://proxy.domain.com:port
```

You can define these settings in the KernelCare config `/etc/sysconfig/kcare/kcare.conf`.

Example: 

```
$ cat /etc/sysconfig/kcare/kcare.conf
AUTO_UPDATE=True
HTTPS_PROXY=http://myproxy.com:59794
```

If you define these settings in the config, you don't need to export them each `kcarectl` launch and don't need to edit cron jobs.

All `kcarectl` launches will be aware of proxy settings from the config. In this case, you need to set proxy settings only once. 

![](/images/patchingthroughproxy.png)

