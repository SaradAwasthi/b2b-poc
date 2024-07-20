import React, { FC, useEffect, useState } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import GetCompany from './GetCompany';

const httpLink = createHttpLink({
  useGETForQueries : false,
  uri: `${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/graphql`,
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
  // uri: 'https://ms-gateway-f4b4o225iq-ue.a.run.app/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


const Company = () => (
  <ApolloProvider client={client}>
    <GetCompany />
  </ApolloProvider>
);

export default Company;
