const pkg = require("./package.json")
const DESC = `Engineering lead focused on AI tooling and developer experience. Creator of OpenCastle (open source). 25+ years of building web apps for enterprise clients.`

module.exports = {
  siteMetadata: {
    title: pkg.description,
    description: DESC,
    author: pkg.author,
    siteUrl: pkg.homepage,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: pkg.description,
        short_name: pkg.name,
        description: DESC,
        start_url: `/`,
        background_color: `#fbfbfb`,
        theme_color: `#fbfbfb`,
        display: `standalone`,
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-svgr",
      options: {
        svgo: false,
        ref: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `./src/images/`,
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "portfolio",
        path: `./src/pages/portfolio/`,
      },
      __key: "portfolio",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "sections",
        path: `./src/sections/`,
      },
      __key: "sections",
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    "gatsby-plugin-sitemap",
    `gatsby-plugin-offline`,
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 550,
              // The only Markdown image is the portrait at the top of the
              // homepage, its largest paint; lazy-loading delayed it.
              loading: "eager",
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-G2NE0WYE84"],
        gtagConfig: {
          anonymize_ip: true,
        },
        pluginConfig: {
          head: false,
        },
      },
    },
  ],
}
