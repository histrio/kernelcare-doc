const urls = require("./urls-mapping.js");

// set your global autometa options
const autoMetaOptions = {
  site: {
    name   : 'KernelCare docs',
    // twitter: 'kc_docs',
  },
  canonical_base: 'https://docs.kernelcare.com/',
};

module.exports = {
  plugins: [
    ['container', {
      type: 'warning',
      before: info => `<div class="warning custom-block"><p class="custom-block-title">${info}</p>`,
      after: '</div>',
    }],
    ['container', {
      type: 'tip',
      before: info => `<div class="tip custom-block"><p class="custom-block-title">${info}</p>`,
      after: '</div>',
    }],
    ['container', {
      type: 'danger',
      before: info => `<div class="danger custom-block"><p class="custom-block-title">${info}</p>`,
      after: '</div>',
    }],
//    ['disqus', { shortname: 'docskernelcarecom' }],
    ['@vuepress/google-analytics',
      {
        'ga': 'UA-12711721-6'
      }
    ],
    [ 'autometa', autoMetaOptions ]
  ],

  base: "/",

  // tracking ids
  head: [
      ["script", { src: "https://js.hs-scripts.com/5408110.js" }], // HubSpot
      ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  fbPixelID: "645174729237247", // facebook pixel

  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    "/": {
      lang: "en-US", // this will be set as the lang attribute on <html>
      title: "Documentation",
      description: "KernelСare documentation"
    },
    "/jp/": {
      lang: "ja",
      title: "ドキュメンテーション",
      description: "KernelCare ドキュメンテーション"
    }
  },
  theme: "cloudlinux",
  themeConfig: {
    repo: "cloudlinux/kernelcare-doc",
    editLinks: true,
    docsBranch: "dev",
    docsDir: "docs",

    defaultURL: "/installation/",
    redirectionMapping: urls,
    sidebarDepth: 2,
    logo: "/logo.svg",
    try_free: "https://www.kernelcare.com/free-trial/",

    social: [
      { url: "https://www.facebook.com/kernelcare/", logo: "/fb.png" },
      { url: "https://twitter.com/kernelcare/", logo: "/tw.png" },
      { url: "https://linkedin.com/company/cloudlinux", logo: "/in.png" },
      {
        url: "https://www.youtube.com/channel/UCZ3YMHWnMP7TaxlXVay5-aw",
        logo: "/ytube.png"
      }
    ],
    cloudlinuxSite: "https://cloudlinux.com",
    locales: {
      "/": {
        // text for the language dropdown title
        title: "Language",
        // text for the language dropdown
        selectText: "En",
        // label for this locale in the language dropdown
        label: "English",
        // text for the edit-on-github link
        editLinkText: "Edit this page",
        tryFree: "Try Free",
        search: "Search",
        // config for Service Worker
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        algolia: {
          apiKey: "c4c1bbf8d3bb32958b26dd7cc5e74472",
          indexName: "kernelcare",
          appId: "R7FCMJM4P7"
        },
        bottomLinks: [
          {
            text: "How to",
            url: "https://www.kernelcare.com/how-to-install-kernelcare/"
          },
          {
            text: "Sales and Technical FAQs",
            url: "https://www.kernelcare.com/faqs/"
          },
          {
            text: "Report an error in documentation",
            url: "https://direct.lc.chat/7898891/5"
          },
          { text: "Blog", url: "https://blog.kernelcare.com/" }
        ],

        sidebar: [
          {
            title: "Content",
            collapsable: false,
            children: [
              "/installation/",
              "/settings/",
              "/command-line/",
              "/how-to/",
              "/config-options/",
              "/disabling-some-patches/",
              "/delayed-feed/",
              "/extra-patchset/",
              "/sticky-patches/",
              "/scanner-interface/",
              "/kc-agent-monitoring/",
              "/upgrade/",
              "/uninstall/",
              "/technology/",
              "/AWS-deployment-guide/",
              "/reseller-partner-ui/",
              "/kernelcare-enterprise/",
              "/kcare-nexpose/",
              "/kernelcare-whmcs-plugin/",
              "/proxy-settings/",
              "/eol-ubuntu-lts-kernels-support/"
            ]
          }
        ]
      },
      "/jp/": {
        title: "言語",
        selectText: "日本語",
        label: "日本語",
        editLinkText: "編集",
        tryFree: "無料で試す",
        search: "検索する",
        serviceWorker: {
          updatePopup: {
            message: "新しいコンテンツが利用可能です",
            buttonText: "最新の情報に更新"
          }
        },
        algolia: {
          apiKey: "c4c1bbf8d3bb32958b26dd7cc5e74472",
          indexName: "kernelcare-jp",
          appId: "R7FCMJM4P7"
        },
        stayInTouch: "連絡を取り合う",
        bottomLinks: [
            {
                text: "ヘルプと使い方",
                url: "https://www.kernelcare.com/how-to-install-kernelcare/"
            },
            {
                text: "よく寄せられる質問",
                url: "https://www.kernelcare.com/faqs/"
            },
            {
                text: "サポート",
                url: "https://cloudlinux.zendesk.com/hc/en-us/requests/new"
            },
            { text: "ブログ", url: "https://blog.kernelcare.com/" }
        ],
        sidebar: [
          {
            title: "コンテンツ",
            collapsable: false,
            children: [
              "/jp/installation/",
              "/jp/settings/",
              "/jp/command-line/",
              "/jp/how-to/",
              "/jp/config-options/",
              "/jp/disabling-some-patches/",
              "/jp/delayed-feed/",
              "/jp/extra-patchset/",
              "/jp/sticky-patches/",
              "/jp/scanner-interface/",
              "/jp/kc-agent-monitoring/",
              "/jp/upgrade/",
              "/jp/uninstall/",
              "/jp/technology/",
              "/jp/AWS-deployment-guide/",
              "/jp/kernelcare-enterprise/",
              "/jp/kcare-nexpose/",
              "/jp/kernelcare-whmcs-plugin/",
              "/jp/proxy-settings/",
              "/jp/eol-ubuntu-lts-kernels-support/"
            ]
          }
        ]
      }
      // "/ru/": {
      //   selectText: "Выберите язык",
      //   label: "Русский",
      //   editLinkText: "Отредактировать на GitHub",
      //   serviceWorker: {
      //     updatePopup: {
      //       message: "Новый контент доступен",
      //       buttonText: "Обновить"
      //     }
      //   },
      //   algolia: {},
      //   sidebar: [
      //     {
      //       title: "Содержание",
      //       collapsable: false,
      //       children: [
      //         "/ru/installation/",
      //         "/ru/settings/",
      //         "/ru/command_line/",
      //         "/ru/config_options/",
      //         "/ru/disabling_some_patches/",
      //         "/ru/delayed_feed/",
      //         "/ru/extra_patchset/",
      //         "/ru/sticky_patches/",
      //         "/ru/nagios_plugin/",
      //         "/ru/zabbix_template/",
      //         "/ru/upgrade/",
      //         "/ru/uninstall/",
      //         "/ru/technology/",
      //         "/ru/AWS_deployment_guide/",
      //         "/ru/reseller_partner_ui/",
      //         "/ru/kernelcare_enterprise/",
      //         "/ru/kcare-nexpose/",
      //         "/ru/kernelcare_whmcs_plugin/",
      //         "/ru/proxy_settings/",
      //         "/ru/eol_ubuntu_lts_kernels_support/"
      //       ]
      //     }
      //   ]
      // }
    }
  }
};
