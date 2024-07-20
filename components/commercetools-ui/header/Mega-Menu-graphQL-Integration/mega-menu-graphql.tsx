import { gql } from '@apollo/client';

export const LOAD_MEGAMENU_DATA = gql`
  {
    categories(where: "externalId=100") {
      results {
        id
        key
        name(locale: "en")
        slug(locale: "en")
        externalId
        orderHint
        ancestors {
          id
          key
          name(locale: "en")
          slug(locale: "en")
        }
        parent {
          id
          key
          name(locale: "en")
          slug(locale: "en")
        }
        children {
          id
          key
          name(locale: "en")
          slug(locale: "en")
          orderHint
          externalId
        }
      }
    }
  }
`;
