module.exports = {
  description:
    "Easily deploy Smart Contract for a Standard, Capped, Mintable, Burnable Token.",
  title: "ABAsset Generator",
  base: "/abasset-generator/",
  head: [
    ["link", { rel: "icon", href: "/favicon.png" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      {
        property: "og:url",
        content: "https://www.newtonproject.org/abasset-generator",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content:
          "https://www.newtonproject.org/static/images/logo_v3/logo.svg?v=450",
      },
    ], // eslint-disable-line max-len
    ["meta", { property: "twitter:card", content: "summary_large_image" }],
    [
      "meta",
      {
        property: "twitter:image",
        content:
          "https://www.newtonproject.org/static/images/logo_v3/logo.svg?v=450",
      },
    ], // eslint-disable-line max-len
    ["meta", { property: "twitter:title", content: "ABAsset Generator" }],
    ["script", { src: "assets/js/web3.min.js" }],
  ],
  plugins: [
    [
      "@vuepress/google-analytics",
      {
        ga: "UA-115756440-2",
      },
    ],
  ],
  defaultNetwork: "ABCoreMainNet",
};
