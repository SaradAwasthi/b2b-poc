import React, { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference, ReferenceLink } from 'helpers/reference';
import DrawerComponent from 'frontastic/tastics/example/cart-drawer';
import CartTastic from 'frontastic/tastics/cart';

interface CartButtonProps {
  cartItemCount?: number;
  cartLink?: Reference;
  data: any;
}

const CartButton: React.FC<CartButtonProps> = ({ cartItemCount, cartLink, data }) => {
  //i18n messages
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="flex justify-center">
      {/* <ReferenceLink target={cartLink} className="group relative -m-2 flex items-center p-2"> */}
      <ShoppingCartIcon
        className="h-6 w-6 shrink-0 stroke-2 text-gray-100 hover:cursor-pointer"
        aria-hidden="true"
        onClick={() => setShowCart(true)}
      />
      {cartItemCount > 0 && (
        <>
          <span className="absolute top-8 right-10 h-4 w-4 rounded-full bg-accent-400 hover:bg-accent-500">
            <span className="flex h-full w-full items-center justify-center text-xs text-white group-hover:text-white">
              {cartItemCount}
            </span>
          </span>
          <span className="sr-only">
            {formatCartMessage({
              id: 'cart.items.in.view',
              defaultMessage: 'items in cart, view cart',
            })}
          </span>
        </>
      )}
      {/* </ReferenceLink> */}
      <DrawerComponent isOpen={showCart} setIsOpen={setShowCart}>
        <CartTastic data={data} />
      </DrawerComponent>
    </div>
  );
};

export default CartButton;
