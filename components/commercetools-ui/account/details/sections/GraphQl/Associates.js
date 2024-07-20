import gql from 'graphql-tag';

export const Load_Associates = gql`
  query {
    businessUnits {
      count
      results {
        name
        associates {
          customer {
            email
          }
          customerRef {
            id
          }
          associateRoleAssignments {
            associateRole {
              key
              id
            }
          }
        }
      }
    }
  }
`;
export const DELETE_ASSOCIATES = gql`
  mutation deleteBusinessUnit($version: Long!, $id: String){
  deleteBusinessUnit(version: $version, id: $id){
    id
    version
    key
    name
  }
}
`;
