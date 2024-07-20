import gql from 'graphql-tag';

export const DELETE_COMPANY = gql`
  mutation deleteBusinessUnit($version: Long!, $id: String) {
    deleteBusinessUnit(version: $version, id: $id) {
      id
      version
      key
      name
    }
  }
`;

