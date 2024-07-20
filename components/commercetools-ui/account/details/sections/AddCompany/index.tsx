import React, { FC, useEffect, useState } from 'react';
// import ApolloCilent from 'apollo-boost';
// import { ApolloProvider } from 'react-apollo';
import AddCompanies from '../AddCompany/addCompany';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
// import { setContext } from 'apollo-link-context';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
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


const AddCompany = () => (
  <ApolloProvider client={client}>
    <AddCompanies />
  </ApolloProvider>
);

export default AddCompany;
