(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{192:function(e,t,n){"use strict";n.r(t);var i=n(0),r=Object(i.a)({},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"content"},[e._m(0),e._v(" "),e._m(1),e._v(" "),n("p",[e._v("Start from installing Nagios monitoring system.")]),e._v(" "),n("p",[e._v("You can download the plugin from "),n("a",{attrs:{href:"http://patches.kernelcare.com/downloads/nagios/check_kcare",target:"_blank",rel:"noopener noreferrer"}},[e._v("http://patches.kernelcare.com/downloads/nagios/check_kcare"),n("OutboundLink")],1)]),e._v(" "),e._m(2),e._v(" "),e._m(3),e._m(4),e._v(" "),e._m(5),e._v(" "),e._m(6),e._v(" "),n("p",[e._v("Script options:")]),e._v(" "),e._m(7),e._v(" "),n("p",[e._v("Here is an example configuration for key-based KernelCare licenses (IP-based section is commented out here):")]),e._v(" "),n("p",[e._v("Example host to associate the KernelCare status check service with")]),e._v(" "),e._m(8),e._m(9),e._v(" "),e._m(10)])},[function(){var e=this.$createElement,t=this._self._c||e;return t("h1",{attrs:{id:"nagios-plugin"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#nagios-plugin","aria-hidden":"true"}},[this._v("#")]),this._v(" Nagios Plugin")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[t("code",[this._v("check_kcare")]),this._v(" is a Nagios plugin that provides a way to monitor the out of date and inactive servers. It can provide information on servers assigned to the KernelCare key, or for all the servers in partner account.")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("Place the plugin into "),t("code",[this._v("/usr/lib64/nagios/plugins/")]),this._v(" directory and make this script executable by running:")])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("chmod +x /usr/lib64/nagios/plugins/check_kcare\n")])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("Create "),t("code",[this._v("kcare.cfg")]),this._v(" configuration file from the template below and place it into "),t("code",[this._v("/etc/nagios/conf.d/")]),this._v(" directory.")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("You will also need to specify your KernelCare key instead of "),t("code",[this._v("KERNELCARE_KEY")]),this._v(". If the licenses are IP-based, you can find your login & API security token in "),t("em",[this._v("Profile")]),this._v(" section of your CLN account.")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("Restart Nagios service and go to Nagios Web UI (http://NAGIOS_IP/nagios/). Click on "),t("em",[this._v("Services")]),this._v(" link (top left under "),t("em",[this._v("Hosts")]),this._v("). You should be able to see a string showing an output from monitoring script (please see screenshots below).")])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("table",[n("thead",[n("tr",[n("th"),e._v(" "),n("th")])]),e._v(" "),n("tbody",[n("tr",[n("td",[n("code",[e._v("-k KERNELCARE_KEY")])]),e._v(" "),n("td",[e._v("retrieve status for servers associated with KEY")])]),e._v(" "),n("tr",[n("td",[n("code",[e._v("-l PARTNER_LOGIN --api-token TOKEN")])]),e._v(" "),n("td",[e._v("retrieve status for all servers in partner account based on login/token")])]),e._v(" "),n("tr",[n("td",[n("code",[e._v("-c o,u,i -- return CRITICAL")])]),e._v(" "),n("td",[e._v("list of coma separated o, u & i."),n("br"),n("code",[e._v("o")]),e._v(" - out of date"),n("br"),n("code",[e._v("u")]),e._v(" - unknown kernel"),n("br"),n("code",[e._v("i")]),e._v(" - inactive server")])]),e._v(" "),n("tr",[n("td",[n("code",[e._v("-w o,u,i -- return WARNING")])]),e._v(" "),n("td",[e._v("list of coma separated o, u & i."),n("br"),n("code",[e._v("o")]),e._v(" - out of date"),n("br"),n("code",[e._v("u")]),e._v(" - unknown kernel"),n("br"),n("code",[e._v("i")]),e._v(" - inactive server")])])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[this._v("define host {\n      host_name                       kcare-service\n      notifications_enabled           0\n      max_check_attempts             1\n      notification_interval           0\n      check_period                   24x7\n}\n \n \ndefine command {\n      command_name     check_kcare\n      command_line     /usr/lib64/nagios/plugins/check_kcare -k $ARG1$\n}\n \ndefine command {\n      command_name     check_kcare_opts\n      command_line     /usr/lib64/nagios/plugins/check_kcare -k $ARG1$ -c $ARG2$ -w $ARG3$\n}\ndefine command {\n      command_name     check_kcare_partner\n      command_line     /usr/lib64/nagios/plugins/check_kcare -l $ARG1$ --api-token $ARG2$\n}\n \ndefine command {\n      command_name     check_kcare_partner_opts\n      command_line     /usr/lib64/nagios/plugins/check_kcare -k $ARG1$ -l $ARG1$ --api-token $ARG2$ -c $ARG2$ -w $ARG3$\n}\n \ndefine service {\n      host_name                       kcare-service\n      service_description             KernelCare Server Status Checker By Key\n      check_command                   check_kcare!KERNELCARE_KEY\n      notifications_enabled           1\n      check_interval                 240\n      retry_interval                 60\n      max_check_attempts             4\n      notification_options           w,c,r\n      check_period                     24x7\n      notification_period             24x7\n}\n \n#define service {\n#       host_name                       kcare-service\n#       service_description             KernelCare Server Status Checker By login/token with outdated/inactive considered as critical\n#       check_command                   check_kcare_partner_opts!partner_login!partner_token!o,i!u\n#       notifications_enabled           1\n#       check_interval                  240\n#       retry_interval                  60\n#       max_check_attempts              4\n#       notification_options            w,c,r\n#       check_period                     24x7\n#       notification_period             24x7\n#}\n")])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[t("img",{attrs:{src:"/images/nagiosservices_zoom70.png",alt:""}})])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[t("img",{attrs:{src:"/images/hmfile_hash_6837b862.png",alt:""}})])}],!1,null,null,null);t.default=r.exports}}]);