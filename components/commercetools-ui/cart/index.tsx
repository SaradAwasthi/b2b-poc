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

const Cart = ({
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
      return a + (b.discountedPrice.centAmount * b.count);
    } else {
      return a + (b.price.centAmount * b.count);
    }
  }, 0.0);

  return (
    <main className="lg:relative-width">
      <h1 className="w-full bg-rc-brand-primary py-4 pl-20 text-2xl font-bold tracking-tight text-gray-100 ">
        {formatCartMessage({ id: 'cart.shopping', defaultMessage: 'Shopping Cart' })}
      </h1>
      {loading ? (
        <div className="flex items-stretch justify-center py-10 px-12">
          <Spinner />
        </div>
      ) : (
        <form className="mt-6 flex flex-col px-10">
          <div className="relative min-h-[28rem] w-full basis-3/4 rounded-md px-0 py-2 w-96 my-6">
            <div className="flex justify-between pb-6">
              <h3 className="text-xl text-gray-900">Product Details</h3>
              
            </div>
            <ItemList
              cart={cart}
              editItemQuantity={editItemQuantity}
              goToProductPage={goToProductPage}
              removeItem={(lineItemId: string) => removeItem(lineItemId)}
            />
            <div className="flex justify-center items-center absolute bottom-0 left-0 h-16 w-full rounded-b-md bg-rc-brand-primary">
              <p className="text-right text-xl text-gray-100">
                Subtotal ({cart?.lineItems.length} item) :{' '}
                <span className="font-bold">{CurrencyHelpers.formatForCurrency(productPrice)}</span>
              </p>
            </div>
          </div>
          <div className="flex relative flex-col">
            <OrderSummary cart={cart} onSubmit={onCheckout} showDiscountsForm={false} />
          </div>
        </form>
      )}
    </main>
  );
};

export default Cart;
