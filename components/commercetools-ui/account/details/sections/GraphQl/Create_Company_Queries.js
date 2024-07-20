import gql from 'graphql-tag';

export const CREATE_COMPANY = gql`
  mutation createBusinessUnit($draft: BusinessUnitDraft!) {
    createBusinessUnit(draft: $draft) {
      key
      name
      unitType
      status
      storeMode

      addresses {
        streetName
        streetNumber
        postalCode
        city
        state
        country
      }
    }
  }
`;
