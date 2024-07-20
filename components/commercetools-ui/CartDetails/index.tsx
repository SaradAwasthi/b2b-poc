import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Cart as CartType } from '@Types/cart/Cart';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference } from 'helpers/reference';
import { NextFrontasticImage } from 'frontastic/lib/image';
import Spinner from '../spinner';
import EmptyCart from './emptyCart';
import ItemList from './itemList';
import OrderSummary from './orderSummary';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { LineItem } from '@Types/cart/LineItem';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export interface Props {
  pageTitle?: string;
  emptyStateImage?: NextFrontasticImage;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateCTALabel?: string;
  emptyStateCTALink?: Reference;
  cart: CartType;
  editItemQuantity: (lineItemId: string, newQuantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => void;
  shippingMethods: ShippingMethod[];
}

const CartDetails = ({
  cart,
  editItemQuantity,
  removeItem,
  shippingMethods,
  pageTitle,
  emptyStateImage,
  emptyStateTitle,
  emptyStateSubtitle,
  emptyStateCTALabel,
  emptyStateCTALink,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(true);

  //i18n messages
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  const router = useRouter();

  const onCheckout = (e: FormEvent) => {
    e.preventDefault();
    router.push('/checkout');
  };

  const goToProductPage = (_url: string) => router.push(_url);

  useEffect(() => {
    if (cart?.lineItems) {
      setLoading(false);
    }
  }, [cart]);

  if (loading) {
    return (
      <div className="flex items-stretch justify-center py-20 px-12">
        <Spinner />
      </div>
    );
  }

  if ((!loading && !cart?.lineItems) || cart.lineItems.length < 1) {
    return (
      <EmptyCart
        pageTitle={pageTitle}
        image={emptyStateImage}
        title={emptyStateTitle}
        subtitle={emptyStateSubtitle}
        ctaLabel={emptyStateCTALabel}
        ctaLink={emptyStateCTALink}
      />
    );
  }
  const productPrice = cart?.lineItems.reduce((a, b: LineItem) => {
    if (b.discountedPrice) {
      return a + b.discountedPrice.centAmount * b.count;
    } else {
      return a + b.price.centAmount * b.count;
    }
  }, 0);
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
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return (
    <main className="">
      <h1 className="w-full bg-primary-100 py-4 pl-20 text-2xl font-bold tracking-tight text-gray-100 ">
        {formatCartMessage({ id: 'cart.shopping', defaultMessage: 'Shopping Cart' })}
      </h1>
      {loading ? (
        <div className="flex items-stretch justify-center py-10 px-12">
          <Spinner />
        </div>
      ) : (
        <form className="flex flex-col px-4">
          <div className="relative w-full py-4">
            <ItemList
              cart={cart}
              editItemQuantity={editItemQuantity}
              goToProductPage={goToProductPage}
              removeItem={(lineItemId: string) => removeItem(lineItemId)}
            />
          </div>
          <div className="basis-1/4">
            <ApolloProvider client={client}>
              <OrderSummary cart={cart} onSubmit={onCheckout} showDiscountsForm={false} />
            </ApolloProvider>
          </div>
        </form>
      )}
    </main>
  );
};

export default CartDetails;
