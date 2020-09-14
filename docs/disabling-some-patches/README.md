# Disabling Some Patches


Some patches might affect the work of the system, and we created a way to disable them.

This is done via `sysctl` command.

When new patchset loads, KernelCare sysctl options get reset. To prevent that we added a file:

`/etc/sysconfig/kcare/sysctl.conf`

Options in this file will be loaded automatically on new patchset load.

To disable loading this options, specify:

`LOAD_KCARE_SYSCTL=0` in `/etc/sysconfig/kcare/kcare.conf`

To disable the patch, set the corresponding kcare option to `1`.

Patches that can be disabled:

| | |
|-|-|
|Patch |  _sysctl_ option|
|CVE-2015-5157 | kcare_modify_ldt|


