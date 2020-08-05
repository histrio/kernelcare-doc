# KernelCare.ePortal

KernelCare.ePortal is a web management console for KernelCare for servers located behind the firewall, with no internet access. It is part of KernelCare Enterprise offering, and should be installed on premisses


## ePortal Hardware Requirements

ePortal machine disk size doesn't change with the number of connected servers.

Requirements are always the same:

* 100 GB minimum
* 200 GB recommended
* SSD

:::tip Note
SSD is the crucial requirement.
:::

As far as other requirements concerned, we have tested the following configuration and the following number of connected servers:

* 10k of connected machines is the maximum for the following requirements:
  * VM
  * 1 VCPU
  * 1 GB RAM 
* 75k of connected machines is the maximum for the following requirements:
  * Core i5
  * 1 CPU
  * 4 GB RAM

## Installation

### KernelCare.ePortal on EL6


To install KernelCare.ePortal, start with the minimal image of EL6

For installation and workability of e-portal nginx web server is required. We recommend to use a stable version from the official nginx repository:

```
$ cat > /etc/yum.repos.d/nginx.repo <<EOL
[nginx]
name=nginx repo
baseurl=https://nginx.org/packages/centos/6/\$basearch/
gpgcheck=0
enabled=1
EOL
```

Please find more information at [https://nginx.org/en/linux_packages.html#stable](https://nginx.org/en/linux_packages.html#stable)

Setup KernelCare.ePortal repo:

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

Install KernelCare.eportal:

```
$ yum install kcare-eportal
```


### KernelCare.ePortal on EL7


 
To install KernelCare.ePortal, start with the minimal image of EL7

For installation and workability of e-portal nginx web server is required. We recommend to use stable version from the official nginx repository:

```
$ cat > /etc/yum.repos.d/nginx.repo <<EOL
[nginx]
name=nginx repo
baseurl=https://nginx.org/packages/centos/7/\$basearch/
gpgcheck=0
enabled=1
EOL
```

Please find more information at [https://nginx.org/en/linux_packages.html#stable](https://nginx.org/en/linux_packages.html#stable)

Setup KernelCare.ePortal repo:

```
$ cat > /etc/yum.repos.d/kcare-eportal.repo <<EOL
[kcare-eportal]
name=KernelCare ePortal
baseurl=https://repo.eportal.kernelcare.com/x86_64.el7/
enabled=1
gpgkey=https://repo.cloudlinux.com/kernelcare/RPM-GPG-KEY-KernelCare
gpgcheck=1
EOL
```

Install KernelCare.eportal:

```
$ yum install kcare-eportal
```

## How to adjust proxy on ePortal machine

On the ePortal machine, you should define the same proxy settings as you use in the command line.

To do so, add <span class="notranslate">`PROXY = 'https://example.com'`</span> to the following file: <span class="notranslate">`/usr/share/kcare-eportal/config/local.py`</span>

If this file doesn't exist, create it with a NGINX owner:

<div class="notranslate">

```
echo "PROXY = 'https://example.com'" > /usr/share/kcare-eportal/config/local.py
chown nginx:nginx /usr/share/kcare-eportal/config/local.py
```
</div>


Restart ePortal (see [Stopping & Starting](/kernelcare-enterprise/#stopping-starting) section, choose a corresponding OS).

## Managing Users


You can manage portal using `/usr/bin/kc.eportal` utility:
| | | |
|-|-|-|
|`-l` | `--list-users`| list all users|
|`-a` | `--add-user`| add a user|
|`-d` | `--delete-user` |delete a user|
|`-c` | `--change-password`| change a user password|
|`-p` | `--password` | provide a password for a user|
|`-h` | `--help` | show this help|
To add a user:

```
$ kc.eportal -a admin -p AdminPassword
```

To change user's password:

```
$ kc.eportal -c admin -p NewPassword
```

### Authorization using LDAP

If you are using ePortal but would like to restrict access for a specific user group then LDAP authorization allows you to check if a user is a member of that specific group.
LDAP search query determines if a user is a member of a group with allowed access.
Moreover, when using group authorization you need to make sure that a user with a specific DN is a member of that allowed access group.

For example, if you’d like to allow access to ePortal server for the users from the `mathematicians` group, you might have a configuration like this:

```
URL: ldap://ldap.forumsys.com 
Filter: dc=example,dc=com??sub?(&(ou=mathematicians)(uniqueMember=uid=%s,dc=example,dc=com)) 
Connection string: uid=%s,dc=example,dc=com 
```

To make any user with any DN to have access to the ePortal server, you might have a configuration like this:

```
URL: ldap://ldap.forumsys.com 
Connection string: uid=%s,dc=example,dc=com
```

**URL**

* `ldap://example.com:389` — a verified encrypted (TLS) connection;
* `ldaps://example.com:636` — an SSL connection.

**Filter**

* `dc=example,dc=com??sub?(&(ou=mathematicians)(uniqueMember=uid=%s,dc=example,dc=com))`

  Filter could be empty as ePortal uses this filter to make a search after LDAP bind (if the result is not empty, the user is authorized).

**Connection String (DN template)**

* `uid=%s,dc=example,dc=com`

  Must contain login placeholder (`%s`).

You can use URL to adjust security and timeout parameters

* `strict_check=0` — to disable strict certificate check (enabled by default);
* `tls=0` — to disable TLS (enabled by default);
* `timeout=30` (in seconds, 5 by default).
  
For example, the URL with the security parameters:

```
ldap://example.com?strict_check=0&timeout=30&tls=0
```

:::tip Note
* You could use `%s` in both `Connection String` and `Filter` fields as a placeholder for user login. 
* Each LDAP implementation has its own peculiar properties, so we cannot provide any specific information about LDAP URL configuration because it depends entirely on the exact LDAP server configuration.
:::

#### Additional

* To retrieve more information, please see [The LDAP URL Format RFC](https://tools.ietf.org/html/rfc2255).
* If you have a question on configuring your LDAP access, please contact our [support](https://www.kernelcare.com/support/).

#### Log in to ePortal with your LDAP credentials

When you log in to ePortal with your LDAP credentials for the first time, a user with LDAP username, read-only permissions, and `LDAP` description is created in the database by default (`https://<eportal>/admin/user/`).

In the picture, you can see one user created with `kc.eportal` command line interface and two users logged in with LDAP credentials.

![](/images/eportalLDAPusers.png)

To set this LDAP user administrator permissions, set `read-only=False` (edit access required).

#### Is there a difference between local users and LDAP users?

The difference is in the login procedure. Login and password for a local user are saved in the local database but for an LDAP user, only login and permission are saved in the local database and authorization proceeds via LDAP server.

When a user logs in to ePortal, ePortal checks the user credentials in the local database at first. If the credentials are found, the user will be authorized, and only if the user credentials are not found, ePortal redirects to LDAP.

## Accessing ePortal


To access KernelCare.eportal management console, connect to:
**https://YOUR_IP/admin**

And enter your login & password

![](/images/access_eportal.png)

You can manage your login information using [kc.eportal tool](/kernelcare-enterprise/#managing-users).

## PatchSet Deployment


:::tip Note
ePortal v0.8+
:::

KernelCare.ePortal has built-in mechanism to download latest patches. To start using it, click _Patch Source_ link in KernelCare.ePortal navigational bar and then click Settings. To get access to the Patch Source, please contact sales@kernelcare.com and request your Patch Source access credentials.

![](/images/eportal_dep01_1_zoom70.png)


Once you set up patch source access info, you will get to a list of available patchsets. You can always go back & change your access info by clicking _Source_ link.

![](/images/eportal_dep02_1_zoom70.png)

Clicking on _[changelog]_ will provide changelog for given patchset.
Clicking on _[deploy this patch, and all before it]_ will download and deploy this patchset and all the patchsets above. It is impossible to deploy patchsets out of order.


## Managing Keys


To register new servers you need to create a KernelCare key that will be used for server registration.
To go to the list of keys, click the KernelCare ePortal logo at the top left.

![](/images/key-menu_zoom70.png)

* To edit a key, click ![](/images/eportal_keys_edit.png) . The _Edit_ tab opens.
* To remove a key, click ![](/images/eportal_keys_remove.png) . Please note, that removing the key would remove all servers under that key.
* Click a key to go to Servers tab with the list of [servers registered](/kernelcare-enterprise/#managing-servers) under that key. You can also remove servers on that tab.

To create a new registration click _Create_ tab.
   ![](/images/key-creation_zoom70.png) 
Fill in the following fields:

* **Key** —  you can provide a key name or leave the field empty, so an automatically generated name will be used
* **Description** — you can provide a description for the key
* **Server Limit** — the amount of servers that can be registered under that key
* **Feed** — select a specific feed or leave empty.

Click _Save_ to add the key. The new registration key will be created and added to the list. The key itself will be used as a part of the registration command on an individual server.

Click _Save and Add Another_ to save this key and add one more key.

Click _Save and Continue Editing_ to add the key and open the key edit tab.

Click _Cancel_ to return to the key list tab without adding a new key.


## Managing Servers


You can see servers belonging to the key by clicking on the key itself in [Managing Keys](/kernelcare-enterprise/#managing-keys) interface.

![](/images/server_list_1_zoom70.png)


The screen shows servers registered under the key, their IP, hostname, effective kernel as well as the time of registration and last check in.

### Managing Script


:::tip Note
If scripts do not work on your ePortal, you might need to update ePortal first. To update ePortal, please run the following command:

```
> yum update kcare-eportal
```
:::
To view the list of all servers IDs that are connected to the particular key, do the following:
* In the UI go to the page with the list of keys. Then click the particular key. The list of servers connected to this key will be displayed.

To view the list of all servers IDs that are not connected to any key, use the <span class="notranslate">_Servers_</span> button on the navigation bar.

![](/images/eportal-servers.png)


### Script to unroll patchsets


To unroll patchset, run:

```
> kc.eportal --unroll 16012017_1
```

### Script to determine the number of servers under the management of ePortal, per key


To see pairs of key/number of servers run:

```
> kc.eportal --list-servers
```
| | |
|-|-|
|Count | Key|
|`0` | `2shcolu7Y1x6885Q`|
|`2` | `6J89aS44j6OmTr05`|


### Script to automatically install latest patchsets

It determines if latest patches are available and installs them to the **default feed**.

```
>kc.eportal --get-latest
```

If you need to update other feeds that are marked for auto update instead of the default one, use a different argument:

```
>kc.eportal --auto-update
```

Note, that the latter command will update only feeds that meet the "_deploy after_" criteria.

### Script to deploy release from a file

If you have no opportunity to connect your eportal to the patch server, you can install it manually:

- upload selected patchset to the eportal
```
rsync -v 04082020_1.tgz your-eportal:/tmp
```

- run deployment tool with unloaded file as a parameter. It should be a full path to the file.
```
>kc.eportal --deploy /tmp/04082020_1.tgz
```

### Unroll patches from UI

 
In the patch-source page, there is a list of available patches. To unroll patches click the button _Roll back this patch, and all after it_.
Use it to roll back the patch and all the following patches.

### Show extended check-in statistics in admin UI

A new table is added to the starting page. This table displays the following:
* Total number of servers.
* Number of servers that checked in for the past 48 hours.

The number of servers for each key is listed in the _Key Inventory_ table.

### Ability to create read-only users

```
[root@localhost ~]# kc.eportal -l
Num | Username
--- + --------------------------------
 1 | admin
 2 | user
[root@localhost ~]# kc.eportal -r user
User 'user' is now readonly
```

### Feed Management



Feeds are intended to manage patchsets on the server, and they provide a possibility to bind a set of patches to a specific key. Possible use cases: for preliminary testing of patches, for applying updates to groups of servers with the similar hardware, etc.

To get into Feeds Management interface go to Settings → Feeds:

![](/images/feed-button_zoom70.png)

On this page a user can manage the existing feeds: create, delete, edit.

![](/images/feed-menu_zoom70.png)

Available options:
* Name — a name of a feed.
* Auto update — enable and disable automatic downloading of patches to this feed.
* Deploy after X hours — a delay in hours between the moment the patchset is available for deployment and the moment it is installed to the feed.

Every 10 minutes ePortal checks for new patches on the main patch server. If a new patch is available, it is uploaded to the ePortal server. Note: it is uploaded but is not deployed. The patch availability time is considered starting from the moment a new patch appears on the ePortal, and that time is taken into account in `Deploy after X hours` option. So, if a user sets `Deploy after X hours = 10`, the patch will be deployed to the feed 10 hours after it has been downloaded to the ePortal server.

To make the feed auto-update immediately (so that, new patches are loaded to the feed immediately after they are available on ePortal), set `Deploy after X hours = 0`.

A special case is a clean installation when ePortal is installed on a new server (there aren't any downloaded archives with patches and feeds with deployed patchsets, including default feed). In this case, if a user creates a new feed and sets Deployed after X hours option right away, then all patches (from the oldest to the latest available) will be deployed to the feed after the specified X hours. This is because the archives are downloaded from scratch and will be considered as “just appeared on ePortal” — that is, all patches will have the same appearance time on ePortal from which the option Deploy after X hours will repel.

![](/images/feedmanagement3_zoom70.png)

On the main ePortal page, a user can set the corresponding key <> feed pair. This is done in the key creation interface or when editing a key.

![](/images/feedmanagement4_zoom70.png)

By default, a new key is bound to the default feed, alternatively, a user can choose a desired feed from the drop-down menu.

![](/images/feedmanagement5_01_zoom70.png)

:::tip Note
When removing a feed all keys attached to this feed will be moved to the default feed.
:::

![](/images/feedmanagement6_zoom70.png)

### Adding extra Tag field


 
To add an extra Tag field for the server, run:

```
kcarectl --tag command
```

where `command` is a parameter defined by a user. This parameter will be displayed in UI for the server. User could add multiple tags for each server. Each tag should be separated with `;` symbol.

Example:

```
kcarectl --tag "env:prod;ubuntu"
```

This server has two tags : `env:prod` and `ubuntu`.

`env:prod` is a parameter that has tag name `env` and the value `prod`.

![](/images/addingextratagfield_zoom88.png)

To remove all tags from a particular server, run:

```
kcarectl --tag ""
```

Where `""` is a parameter to delete the previously defined tag.


### How to setup ePortal to use HTTPS


Some assumptions for a server where e-portal is deployed:

1. A firewall is disabled for 443 port.
2. Private and public keys are downloaded on the server.

* Edit ssl configuration template according to your certificates:

```
mv /etc/nginx/eportal.ssl.conf.example /etc/nginx/eportal.ssl.conf
vi /etc/nginx/eportal.ssl.conf
```

* Include this configuration into the main one:

```
sed -e '3iinclude eportal.ssl.conf;' -i /etc/nginx/conf.d/eportal.conf
```

* Restart nginx:

```
service nginx restart
```

In order to communicate with e-portal, updated to https, you need to modify KernelCare config files on all the servers if they have IPs hardcoded servers settings.

To do that, update `PATCH_SERVER` and `REGISTRATION_URL` environment variables:

```
vi /etc/sysconfig/kcare/kcare.conf
```

So, after editing your `/etc/sysconfig/kcare/kcare.conf` should contain updated `PATCH_SERVER` and `REGISTRATION_URL` environment variables like in the example below:

```
PATCH_SERVER=https://eportal_domain_name/
REGISTRATION_URL=https://eportal_domain_name/admin/api/kcare
```

The following example demonstrates how to connect new servers to e-portal configured for https:

```
$ export KCARE_PATCH_SERVER=https://eportal_domain_name/
$ export KCARE_REGISTRATION_URL=https://eportal_domain_name/admin/api/kcare
$ export KCARE_MAILTO=admin@mycompany.com
$ curl -s https://repo.cloudlinux.com/kernelcare/kernelcare_install.sh | bash
$ /usr/bin/kcarectl --register key_from_your_eportal
```

## Deploying KernelCare


To deploy kernelcare client software to use ePortal, the following environment variables should be setup prior to RPM install:

| |  | |
|-|--|-|
|**Environment Variable** | **Value** | **Description**|
|`KCARE_PATCH_SERVER` | http://eportal_ip/ | URL to a server from which patches will be downloaded|
|`KCARE_REGISTRATION_URL` | http://eportal_ip/admin/api/kcare | URL to ePortal's api|
|`KCARE_MAILTO [2.5+]` | email@address | Email to receive all notifications related to failed KernelCare updates. Used in `/etc/cron.d/kcare-cron`|

Example:

```
$ export KCARE_PATCH_SERVER=http://10.1.10.115/
$ export KCARE_REGISTRATION_URL=http://10.1.10.115/admin/api/kcare
$ export KCARE_MAILTO=admin@mycompany.com
$ curl -s https://repo.cloudlinux.com/kernelcare/kernelcare_install.sh | bash
$ kcarectl --register r72fF838Q47oWigj
```

## KernelCare client config file


KernelCare client configuration file is located in `/etc/sysconfig/kcare/kcare.conf`

Example:

```
AUTO_UPDATE=True
PATCH_SERVER=http://10.1.10.115/
REGISTRATION_URL=http://10.1.10.115/admin/api/kcare
```

If `AUTO_UPDATE` set to `True`, KernelCare client will check in every 4 hours, and try to download and apply latest patches

`PATCH_SERVER` - server from which patches will be downloaded

`REGISTRATION_URL` - URL used to register/unregister server


## Deployment Automation

It is possible to use automation tools like Ansible/Puppet/Chef/Salt to install and operate KernelCare on a big number of systems.

The deployment process includes:

* downloading and running the KernelCare agent installation script
* updating `/etc/sysconfig/kcare/kcare.conf` with ePortal-related entries
* registering KernelCare agents using an activation key

### Ansible

To start the automated deployment, you need to specify the following information:

* ePortal server name (or IP) in the `eportal_srv` Ansible variable. Other config file options can be found at [Config Options](/config-options/) and [KernelCare client config file](/kernelcare-enterprise/#kernelcare-client-config-file) (ePortal).
* an activation key in the `activation_key` Ansible variable. Activation keys can be generated in ePortal as described in [Managing Keys](/kernelcare-enterprise/#managing-keys) (ePortal). 

Ansible playbook for deployment phase may look like:

```
- hosts: kernelcare
  vars:
    eportal_srv: http://192.168.250.19
    activation_key: 89gRVCp1rY0ZQ053
  tasks:
  - name: Download the installation shell script
    get_url:
      url: "{{ eportal_srv }}/installer"
      dest: /root/kc-install.sh
      mode: '0700'

  - name: Run the installation shell script
    shell: /root/kc-install.sh >> /var/log/kcare_install.log
    environment:
      KCARE_REPO: "{{ eportal_srv }}/repo"

  - name: Update kcare.conf with ePortal configuration
    blockinfile:
      path: /etc/sysconfig/kcare/kcare.conf
      create: yes
      block: |
        PATCH_SERVER={{ eportal_srv }}/
        REGISTRATION_URL={{ eportal_srv }}/admin/api/kcare

  - name: register KernelCare agents
    command: /usr/bin/kcarectl --register {{ activation_key }}
```

Ansible playbook file example for KernelCare agent removal:

```
- hosts: kernelcare
  tasks:
    - name: unregister KernelCare agents
      command: /usr/bin/kcarectl --unregister
      ignore_errors: yes
      args:
        removes: /usr/bin/kcarectl

    - name: remove kernelcare package
      package:
        name: kernelcare
        state: absent
```

## Changing ePortal IP


You can change ePortal IP at any moment, but you need to modify KernelCare config files on all the servers if they have IPs hardcoded.

To do that, edit: `/etc/sysconfig/kcare/kcare.conf`

Change:

```
PATCH_SERVER=http://10.1.10.115/
REGISTRATION_URL=http://10.1.10.115/admin/api/kcare
```

To point to the right location.


## Configuration & locations


Web Server (nginx) configuration is located at `/etc/nginx/conf.d/eportal.conf`

Database (sqlite) is stored in `/usr/share/kcare-eportal/data.sqlite`
To reset database:

```
$ mv /usr/share/kcare-eportal/data.sqlite /usr/share/kcare-eportal/data.sqlite_backup
$ cd /usr/share/kcare-eportal && python createdb.py
```

Client access data file used to decide if server has access to the patches is stored in `/usr/share/kcare-eportal/kcare_servers.htpasswd`

Patches are stored in: `/usr/share/kcare-eportal/patches`


## Stopping & Starting


### KernelCare.ePortal on EL6



To stop/start/reload/restart configuration of nginx server:

```
$ /etc/init.d/nginx stop|start|reload|restart
```

To stop/start/restart ePortal (Python):

```
$ /etc/init.d/uwsgi stop|start|restart
```


### KernelCare.ePortal on EL7



To stop/start/reload/restart configuration of nginx server:

```
$ systemctl stop|start|reload|restart nginx
```

To stop/start/restart ePortal (Python):

```
$ systemctl stop|start|restart emperor.uwsgi
```


## Log Files


ePortal messages/errors: `/var/log/uwsgi/uwsgi-emperor.log`

nginx ePortal access log: `/var/log/nginx/kcare-eportal.log`

nginx error log: `/var/log/nginx/error_log`


### Log Rotation

By default there is no predefined parameters for eportal's logs rotation. If you want to enable it for the files listed above:
 - Install `logrotate` package 
 - Create/edit `/etc/logrotate.d/eportal` configuration file 
 
 Example logrotate config:

```
/var/log/nginx/kcare-eportal.log {
    daily
    rotate 5 # keep 5 last archives
    missingok # it's ok if there is no such file
    notifempty # do nothing if file is empty
    compress 
}
```


## Nagios & Zabbix support


KernelCare.ePortal since version 1.2 supports server monitoring similar to [Nagios](/kc-agent-monitoring/#nagios-plugin) & [Zabbix](/kc-agent-monitoring/#zabbix-template) monitoring.

You can curl the API directly to receive the information:

```
https://yourserver/admin/api/kcare/nagios/KCAREKEY
```

or you can use [https://patches.kernelcare.com/downloads/nagios/check_kcare](https://patches.kernelcare.com/downloads/nagios/check_kcare) script by modifying KEY_KCARE_NAGIOS_ENDPOINT in it to point to your server (change [https://cln.cloudlinux.com/clweb](https://cln.cloudlinux.com/clweb) (link to old UI) or [https://cln.cloudlinux.com/console/auth/login](https://cln.cloudlinux.com/console/auth/login) (link to new UI) with [https://yourserver/admin](https://yourserver/admin) ).

:::tip Note
Access using `PARTNER_LOGIN/TOKEN` is not supported by KernelCare.ePortal.
:::

## Usage reports

In common case, usage reports are sending automatically but when it's not possible, ePortals will try to send report as an email. That requires configured Sendmail (SSMTP) on the host. You can find a short instruction below.

If mail sending attempt fails, ePortal will save the reports in `/usr/share/kcare-eportal/reports` which should be sent manually.

### How to configure Sendmail (SSMTP)

First of all you need to install `ssmtp`:

    yum install -y ssmtp

Edit `/etc/ssmtp/ssmtp.conf` file in accordance with your SMTP server configuration. Here is a simple config file describing a common way to connect to Gmail accounts: 

    root=username@gmail.com
    mailhub=smtp.gmail.com:587
    hostname=localhost
    UseSTARTTLS=YES
    AuthUser=username@gmail.com
    AuthPass=xxxxxxxxxxxxxxxxxxx
    FromLineOverride=YES
    TLS_CA_File=/etc/ssl/certs/ca-certificates.crt

Actual location of a TLS_CA_Files depends on distrib:

    "/etc/ssl/certs/ca-certificates.crt",                // Debian/Ubuntu/Gentoo etc.
    "/etc/pki/tls/certs/ca-bundle.crt",                  // Fedora/RHEL 6
    "/etc/ssl/ca-bundle.pem",                            // OpenSUSE
    "/etc/pki/tls/cacert.pem",                           // OpenELEC
    "/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem", // CentOS/RHEL 7

Also you could get if from:

    curl-config --ca

Now you can test a connection:

    echo -n 'Subject: test\n\nTesting ssmtp' | sendmail -v some-recipient@gmail.com

## Custom environment variables

You can define your own environment variables for ePortal process.

There is the `/usr/share/kcare-eportal/environment` folder, which is basically daemon tools compatible envdir.

For example, to disable the default https verification you can set the `PYTHONHTTPSVERIFY` environment variable to `0` as follows:

```
echo 0 > /usr/share/kcare-eportal/environment/PYTHONHTTPSVERIFY`
```

<Disqus/>
