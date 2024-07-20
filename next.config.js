const { i18n, localePath } = require('./next-i18next.config');
const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: true,
    register: false,
  },
  env: {
     //Algolia Credentials------------
    ALGOLIA_APPLICATION_ID: '9ZWIVNQJGZ',
    ALGOLIA_APPLICATION_KEY: 'ee621e1f9ffa64f77f2db381d4e1149e',
    ALGOLIA_INDEX_NAME: 'myOwnBranch_Algolia',

    // Commercetools Credentials------------
    commercetools_clientId: 'yU84DD5rgkjH7Thjc9gTgyNS',
    commercetools_clientSecret: 'DvfeKObC6YFc09ukszbGS_r6XMwGAL6P',
    commercetools_projectKey: 'rc_b2b_shop_july_2023',
    commercetools_authUrl: 'https://auth.us-central1.gcp.commercetools.com',
    commercetools_hostUrl: 'https://api.us-central1.gcp.commercetools.com',
    commercetools_baseUrl:
      'https://auth.us-central1.gcp.commercetools.com/oauth/rc_b2b_shop_july_2023/anonymous/token?grant_type=client_credentials',


  },
  i18n,
  localePath,
  images: {
    // loader: 'cloudinary',
    loader: 'custom',
    domains: ['res.cloudinary.com', 's3-eu-west-1.amazonaws.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // path: `https://res.cloudinary.com/dlwdq84ig/image/upload/`,
  },
  webpack(config, { webpack, buildId }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

        if (buildId !== 'development') {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': {
            NEXT_PUBLIC_EXT_BUILD_ID: JSON.stringify(process.env.NEXT_PUBLIC_EXT_BUILD_ID),
          },
        }),
      );
    }

    return config;
  },
});
