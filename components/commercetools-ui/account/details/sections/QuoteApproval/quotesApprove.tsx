import React, { FC, useEffect, useState } from 'react';
//import ApolloClient from 'apollo-boost';
//import { ApolloProvider } from 'react-apollo';
import QuotesApproval from './QuotesApproval';
import { ApolloClient, createHttpLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  //get authentication token from local storage, if it is exist.
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
  //uri: 'https://ms-gateway-f4b4o225iq-ue.a.run.app/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const QuotesApprove = () => (
  <ApolloProvider client={client}>
    <QuotesApproval />
  </ApolloProvider>
);

export default QuotesApprove;
