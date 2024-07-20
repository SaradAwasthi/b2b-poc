import gql from 'graphql-tag';

export const CREATE_QUOTE = gql`
  mutation createQuoteRequest($draft: QuoteRequestDraft!) {
    createQuoteRequest(draft: $draft) {
      id
      version
      createdAt
      lastModifiedAt
      quoteRequestState
      customer {
        id
        firstName
        lastName
      }
      lineItems {
        id
        productId
        nameAllLocales {
          value
          locale
        }
        productType {
          id
          version
        }
        productSlugAllLocales {
          locale
          value
        }
        variant {
          id
          sku
          prices {
            value {
              type
              fractionDigits
              currencyCode
              centAmount
            }
            id
          }
          images {
            url
          }
        }
        price {
          value {
            type
            fractionDigits
            currencyCode
            centAmount
          }
          id
        }
        quantity
        state {
          quantity
          state {
            id
            type
          }
        }
        totalPrice {
          type
          currencyCode
          fractionDigits
          centAmount
        }
        shippingDetails {
          targets {
            addressKey
            quantity
            shippingMethodKey
          }
          valid
        }
      }
    }
  }
`;

export const LOAD_USERS = gql`
  query quoteRequests($limit: Int, $sort: [String!]) {
    quoteRequests(limit: $limit, sort: $sort) {
      offset
      count
      total
      exists
      results {
        id
        version
        quoteRequestState
        comment
        customer {
          email
          firstName
        }
        lineItems {
          nameAllLocales {
            locale
            value
          }
          price {
            value {
              currencyCode
              centAmount
            }
          }
          quantity
          totalPrice {
            currencyCode
            centAmount
          }
          variant {
            sku
          }
        }
        shippingAddress {
          id
          streetName
          streetNumber
          postalCode
          city
          country
        }
        createdAt
        lastModifiedAt
      }
    }
  }
`;

export const UPDATE_QUOTE = gql`
  mutation updateQuoteRequest($id: String, $version: Long!, $actions: [QuoteRequestUpdateAction!]!) {
    updateQuoteRequest(id: $id, version: $version, actions: $actions) {
      id
      version
      createdAt
      lastModifiedAt
      quoteRequestState
      comment
      customer {
        id
        email
      }
      lineItems {
        id
        productId
        nameAllLocales {
          locale
          value
        }
        productType {
          id
          version
        }
        productSlugAllLocales {
          locale
          value
        }
        variant {
          id
          sku
          prices {
            id
            value {
              type
              currencyCode
              centAmount
              fractionDigits
            }
          }
          images {
            url
          }
          attributesRaw {
            name
            value
          }
        }
        price {
          id
          value {
            currencyCode
            centAmount
            fractionDigits
          }
        }
        quantity
        state {
          quantity
          state {
            type
            id
          }
        }
        totalPrice {
          centAmount
          currencyCode
          fractionDigits
        }
        discountedPricePerQuantity {
          quantity
          discountedPrice {
            value {
              currencyCode
              centAmount
            }
          }
        }
      }
    }
  }
`;
