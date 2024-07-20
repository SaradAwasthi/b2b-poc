import React from 'react';
// import Cart from 'components/commercetools-ui/cart';
import { useCart } from 'frontastic/provider';
import CartDetails from 'components/commercetools-ui/CartDetails';

const CartDetailsTastic = ({ data }) => {
  const { data: cartList, removeItem, updateItem, shippingMethods } = useCart();
  console.log("Cart data: " + JSON.stringify(data));
  const editItemQuantity = (lineItemId: string, newQuantity: number) => updateItem(lineItemId, newQuantity);
  return (
    <CartDetails
      cart={cartList}
      removeItem={removeItem}
      editItemQuantity={editItemQuantity}
      shippingMethods={shippingMethods?.data}
      pageTitle={data.pageTitle}
      emptyStateImage={data.emptyStateImage}
      emptyStateTitle={data.emptyStateTitle}
      emptyStateSubtitle={data.emptyStateSubtitle}
      emptyStateCTALabel={data.emptyStateCTALabel}
      emptyStateCTALink={data.emptyStateCTALink}
    />
  );
};

export default CartDetailsTastic;
