# Kcare-nexpose (deprecated)

:::warning Warning
This section is deprecated - refer to [Scanner Interface](/scanner-interface/) section for scanner-related information
:::


The script marks vulnerabilities detected by Nexpose, but patched by KernelCare as exceptions.

:::tip Note
If you are new in Nexpose, please read the [official documentation](https://nexpose.help.rapid7.com/docs/) on how to set up and operate.
:::

## Installation


### From yum repository

To install kcare-nexpose, start with the minimal image of EL6:

```
$ cat > /etc/yum.repos.d/kcare-eportal.repo <<EOL
[kcare-eportal]
name=kcare-eportal
baseurl=https://repo.eportal.kernelcare.com/x86_64/
gpgkey=https://repo.cloudlinux.com/kernelcare-debian/6/conf/kcaredsa_pub.gpg
enabled=1
gpgcheck=1
EOL
```

To install kcare-nexpose, run the command:

```
$ yum install kcare-nexpose
```

 
### From GitHub
 
```
$ git clone https://github.com/cloudlinux/kcare-nexpose.git
$ cd kcare-nexpose/
$ python setup.py install
$ pip install -r REQUIREMENTS
```

## How It Works


The script finds CVEs that are related to patches applied by KernelCare (downloaded either from KernelCare ePortal or the central KernelCare patch server) and excludes them from Nexpose vulnerability scanner reports. The script can approve this exception in Nexpose (if you do not want to approve, set `is_approve` to `false` in the script config). It can also remove the old exceptions left from the previous script runs (set `delete_old` to `true` in the script config).

First, you should generate report in Nexpose (see supported report types below) and specify it in the config file. Also you need to specify some other [parameters](/kcare-nexpose/#yaml-config-file-description):

```
$ cp /usr/local/etc/kcare-nexpose.yml.template /usr/local/etc/kcare-nexpose.yml
$ vim /usr/local/etc/kcare-nexpose.yml
```

:::tip Note
IP address in Nexpose and the one in KernelCare ePortal should be the same. If you use Nexpose and KernelCare ePortal on different instances, you should make sure that Nexpose and KernelCare ePortal are not using localhost (127.0.0.1). Otherwise, kcare-nexpose can mark vulnerability wrong, as it just analyzes IP addresses from Nexpose and KernelCare ePortal. If used with CLN license server, the script can work with servers behind NAT by matching them by their hostnames.
:::
 
### Supported report types

:::warning Note
Please make sure that you have configured a [site](https://nexpose.help.rapid7.com/docs/what-is-a-site) and a [scan](https://nexpose.help.rapid7.com/docs/selecting-a-scan-engine-for-a-site) before creating a report.
:::

_raw-xml-v2_

![](/images/nexpose-xml2_zoom70.png)

## How To Launch


To launch kcare-nexpose run:

```
$ kcare-nexpose -c /usr/local/etc/kcare-nexpose.yml
```

## YAML config file description


```
# Nexpose section
nexpose:
 
# Host to connect with Nexpose Security Console
 host: 192.168.100.100
 
 # Port to connect with Nexpose Security Console
 port: 3780
 
 # Username to auth with Nexpose Security Console
 username: admin
 
 # Password to auth with Nexpose Security Console
 password: hup^r37kZc72MjY}=ox?WTQ
 
 # Report name which will be analyzed for look up related CVE with kernelcare ePortal
 report-name: kernelcare
 
 # Change this to 'true' if you want the script to automatically mark
 # vulnerabilities as exceptions, so they don't show up in the report
 is_approve: true
 
 # If you want to delete old exceptions. If it is false, old exceptions will not be deleted
 delete_old: true
 
 format: raw-xml-v2
 
# License and patch server section
patch-server:
 
 # URL to connect to Kernelcare ePortal
 # For kernelcare ePortal use "https://<kernel-care-eportal-domain-name-or-ip>/admin/api/kcare/patchset/"
 # For licenses issued by CLN, use "https://cln.cloudlinux.com/api/kcare/patchset.json?key="
 server: https://cln.cloudlinux.com/api/kcare/patchset.json?key=
 
 # Server for patch sets
 # For patch sets from Kernelcare ePortal server use domain name
 # (or IP address)
 # patches-info: https://<kernel-care-eportal-domain-name-or-ip>
 
 # For patch sets from the central KernelCare patch server
 patches-info: https://patches.kernelcare.com/
 
 # List of KernelCare license keys
 keys:
   - 0G0996952sTtCU4z
   - hx5LO1n49zY5jp6B
```

