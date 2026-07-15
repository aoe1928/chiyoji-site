module.exports = {
  siteMetadata: {
    title: `ちよじのホームページ`,
    siteUrl: `https://www.aoe1928.com`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: { maxWidth: 300 },
          },
        ],
      },
    },
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `locale`,
        path: `${__dirname}/locales`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`,
        languages: [`ja`, `en`],
        defaultLanguage: `ja`,
        siteUrl: `https://www.aoe1928.com`,
        i18nextOptions: {
          interpolation: { escapeValue: false },
          keySeparator: false,
          nsSeparator: false,
        },
      },
    },
  ],
};
