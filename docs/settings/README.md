# Basic Management


To disable automatic updates:

Edit file `/etc/sysconfig/kcare/kcare.conf`

```
AUTO_UPDATE=False 
```

To check the updated ('effective') version run:

```
$ /usr/bin/kcarectl --uname 
```

We provide convenience script `/usr/bin/kcare-uname` that has same syntax as `uname`.

To see applied patches run:

```
$ /usr/bin/kcarectl --patch-info 
```

