import React from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import CreateQuote from './createQuote';

const httpLink = createHttpLink({
  uri: `https://api.us-central1.gcp.commercetools.com/rc_b2b_shop_july_2023/graphql`,
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('BearerToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const Quotes = () => {
  return (
    <ApolloProvider client={client}>
      <CreateQuote />
    </ApolloProvider>
  );
};

export default Quotes;
