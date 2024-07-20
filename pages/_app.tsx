import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import Toaster from 'components/commercetools-ui/toaster';
import { FrontasticProvider } from 'frontastic';
import 'tailwindcss/tailwind.css';
import '../styles/app.css';
import '../styles/themes/default.css';
import '../styles/themes/theme1.css';
import '../styles/themes/theme2.css';
import '../styles/themes/theme3.css';
import '../styles/components/slider.css';
import '../styles/components/default-loader.css';
// import 'bootstrap/scss/bootstrap.scss';
// import 'react-bootstrap-grid-component/dist/sizingbreakpoints.scss';
// Configuratio for Apollo graphql Client
import axios from 'axios';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  //uri: `${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/graphql`,
  uri: `https://api.us-central1.gcp.commercetools.com/rc_b2b_shop_july_2023/graphql`,
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  // return the headers to the context so httpLink can read them

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function FrontasticStarter({ Component, pageProps }: AppProps) {
  const [tokenLoaded, setTokenLoaded] = useState(false);

  //Load auth token for API calls
  useEffect(() => {
    axios
      .post(
        'https://auth.us-central1.gcp.commercetools.com/oauth/rc_b2b_shop_july_2023/anonymous/token?grant_type=client_credentials',
        {},
        {
          auth: {
            username: 'EMix5Hib5qQVmzGrufsJijYU',
            password: 'VQvvR9tmQlCddVwHvouEn6jmey2pRltm',
          },
        },
      )
      .then((response) => {
        // console.log('RESPONSE RECEIVED OR NOT', response);
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data['access_token']);
          setTokenLoaded(true);
        }
      });
  }, []);

  return (
    <FrontasticProvider>
      {tokenLoaded && (
        <>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
            <Toaster />
          </ApolloProvider>
        </>
      )}
    </FrontasticProvider>
  );
}

export default appWithTranslation(FrontasticStarter);
