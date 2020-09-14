# KernelCare on AWS – Deployment User Guide

[[TOC]]

## Introductory Material

### Introduction

The Linux kernel is the most important piece of the software on your server, as a security flaw in it can expose all of your services and customers' data. KernelCare is a technology that allows you to keep the Linux kernel safe at all times, automatically, without ever having to stop the server and rebooting it causing downtime and inconvenient scheduling of maintenance windows. This improves availability, security, stability, operation costs, and customer satisfaction. It works with almost all mainstream distributions of Linux. It is simple, fast, and very easy to deploy while being able to handle very complex patches and customized kernels if you need them.

### Prerequisites and Requirements

KernelCare can be installed on any x86_64 compatible server or VM running one of the following distribution:
* Amazon Linux 1, 2
* CentOS 6, 7, Xen4CentOS, CentOS-Plus, ElRepo
* CloudLinux 6, 7
* Debian 7, 8, 9, 8-backports
* Oracle Linux 6, 7
* ProxmoxVE 3,4,5
* RedHat EL 6, 7
* Ubuntu 14.04, 16.04, 18.04
* Virtuozzo 6

The exact list of compatible kernels can be found on the following link: [https://patches.kernelcare.com/](https://patches.kernelcare.com/).

Standard OS kernels are required in most cases unless the custom kernel is supported.

The software can be installed on the running server and doesn't require a reboot.

Basic Linux skills are sufficient to deploy KernelCare on AWS. Simple deployments involve just an EC2 instance. KernelCare is available as BYOL model. You need to register in our [customer portal](https://cln.cloudlinux.com) to get the trial license. Once you get the trial license, you need to register your running EC2 instance with the activation key.


### Architecture Diagrams

As long as your servers have access to the Internet, even behind NAT – you will be able to use KernelCare patch server without any problems.

Generally, KernelCare requires HTTPS connection to two servers for the proper work:

* cln.cloudlinux.com
* patches.kernelcare.com


![](/images/AWS_arch2.png)

If your servers don't have direct Internet access but can gain access to the Internet using proxy, the configuration is not that different. KernelCare can pick up standard environment variables for proxy.

![](/images/AWS_proxy_arch2.png)

Make sure you have environment settings for proxy setup, and everything else will be the same as if the servers were directly connected to the Internet:

```
# export http_proxy=http://proxy.domain.com:port
# export https_proxy=http://proxy.domain.com:port
```

## Planning Guidance

### Security

The only thing you need to be able to install/control you KernelCare deployment is SSH access (root credentials, key-based authentication/sudo or similar mechanisms are preferred).

### Costs

KernelCare is billed as a subscription service – you can find more details in the table below.

| **License Volume** | **Monthly Price** | **Annual Price** |
| ----------- | ----------- | ----------- |
| 1      | $3.95       | $45       |
| 2-49   | $2.95       | $33       |
| 50-499 | $2.55       | $28       |
| 500+   | $2.25       | $25       |

### Sizing

KernelCare agent has a tiny RAM footprint – binary patches usually require less than 1 MB.

## Deployment Guidance

### Deployment Assets

To install KernelCare, run:

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

You can easily automate KernelCare deployment with Ansible, Puppet, Chef or other automation tools. 
Here are the steps that may be automated:

1. Distribute KernelCare agent package (optional – required only for servers with no access to the Internet) and a KernelCare agent configuration file (`/etc/sysconfig/kcare/kcare.conf`).
2. Set required environmental variables (optional).
3. Install KernelCare agent from either locally available package or central KernelCare download location.
4. Register KernelCare with either license key or IP-based license.

## Operational Guidance

### Health Check

Systems protected by KernelCare can be monitored by means of CloudLinux Network (CLN) portal available at [https://cln.cloudlinux.com](https://cln.cloudlinux.com). Registered KernelCare installations are grouped by license keys. Kernels that are marked with exclamation sign in <span style="color:#E76930">amber</span> do not have the latest patches installed.

![](/images/KC-Ent-monit.png)

In either case, you can check whether the latest available patch has been applied by running the following command on a system protected by KernelCare:

```
$ /usr/bin/kcarectl --check
```
### Backup and Recovery

There is no reason to backup KernelCare. KernelCare doesn't store any data. You can always re-install and re-register KernelCare.
To backup the configuration file of KernelCare if you have modified it, backup the `/etc/sysconfig/kcare/` folder.

### Routine Maintenance

KernelCare is packaged in RPM/DEB packages (depending on Linux distribution) and will update any time system packages are updated. No additional maintenance is needed.

### Emergency Maintenance

If one of your instances degraded, once you start another instance based on EBS or snapshot – KernelCare will continue working as before, no additional work is needed.
If you set up a new server instead, re-register KernelCare on the new server.
If you decide to uninstall patches, run command:

```
# kcarectl --unload
```

or complete remove *kernelcare* package by running the following command:

* on RPM-based systems
    ```
    # rpm -e kernelcare
    ```
or
*  on DEB-based systems
    ```
    # dpkg --remove kernelcare
    ```
### Patch Feed Advanced Options

#### **Test and Delayed Feeds**

KernelCare Patch Server has several patch feeds available in addition to the standard (production) feed:
* **Test feed** – the newest patches (test builds) that have not undergone the complete testing process. Test feed makes it possible to start testing new patches earlier.
* **Delayed feeds** – instructs KernelCare to skip loading patches that were released within the last 12/24/48 hours.

The alternate feed option is enabled by setting `PREFIX` variable in `/etc/sysconfig/kcare/kcare.conf` to one of `test`/`12h`/`24h`/`48h`.

#### **Feed Management With Sticky Patch Feature**

The best way to handle QA and Production environments is to use Sticky tag feature of KernelCare license keys issued from CloudLinux Network (CLN) portal. 
To use this tag, go to CLN portal → KernelCare tab → click on the target key → Edit Key Info window.

![](/images/KC-Ent-list.png)

![](/images/KC-Ent-edit.png)

You should provide a separate key for each environment and set them to a particular sticky tag which is actually the date to which all the servers in an environment have to be patched.

![](/images/KC-Ent-sticky.png)

The date in Sticky tag field can be any date from May 28, 2018 up to one day before today.

To use Sticky tag feature on the servers to be patched, run:

```
$ /usr/bin/kcarectl --set-sticky-patch=KEY
```

Alternatively, you can do the same by adding `STICKY_PATCH=KEY` to the `/etc/sysconfig/kcare/kcare.conf` file.
  
:::tip Warning
**Do Not** replace the `KEY` word with the actual KernelCare license key used to register the server.
:::

When the Sticky tag feature is enabled for particular servers, all such servers will get patches only released before the date specified in the Sticky tag field.

This way, you can add new patches to all the servers in some environment (i.e. registered with the same KernelCare license key) by updating only a single field in the CLN portal.

## Support

We offer unlimited, 24x7x365 support. [Submit a request](https://cloudlinux.zendesk.com/hc/requests/new) or email us at [support@cloudlinux.com](mailto:support@cloudlinux.com).
* We answer all support questions within one business day and most within a couple of hours
To expedite the support, run the following command on your server (as root user):
```
# kcarectl --doctor
```
 Then paste the generated key into the support request.

### Support Costs

Your KernelCare subscription includes free 24/7 support.

## Accessibility

### Reference Materials

* KernelCare website: [https://www.kernelcare.com](https://www.kernelcare.com)
* KernelCare Blog: [https://www.kernelcare.com/blog/](https://www.kernelcare.com/blog/)
* KernelCare Patch Server: [https://patches.kernelcare.com](https://patches.kernelcare.com)
* KernelCare documentation: [https://docs.kernelcare.com/](https://docs.kernelcare.com/)
* CloudLinux Network – CLN (Billing Portal): [https://cln.cloudlinux.com](https://cln.cloudlinux.com)
* CloudLinux 24/7 online support system: [https://cloudlinux.zendesk.com](https://cloudlinux.zendesk.com)
  
### Localization

KernelCare is available in the English language only.

