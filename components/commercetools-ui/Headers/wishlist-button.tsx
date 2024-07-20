import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/outline';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference, ReferenceLink } from 'helpers/reference';
import DrawerComponent from 'frontastic/tastics/example/cart-drawer';
import WishlistTastic from 'frontastic/tastics/wishlist';

interface WishListButtonProps {
  wishlistItemCount?: number;
  wishlistLink?: Reference;
  data: any;
}

const WishListButton: React.FC<WishListButtonProps> = ({ wishlistItemCount, wishlistLink, data }) => {
  //i18n messages
  const { formatMessage: formatWishlistMessage } = useFormat({ name: 'wishlist' });
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="flex justify-center">
      <HeartIcon
        className="h-6 w-6 shrink-0 stroke-2 text-gray-100 hover:cursor-pointer"
        aria-hidden="true"
        onClick={() => setShowCart(true)}
      />
      {wishlistItemCount > 0 && (
        <>
          <span className="absolute top-8 right-24 h-4 w-4 rounded-full bg-accent-400 hover:bg-accent-500">
            <span className="flex h-full w-full items-center justify-center text-xs text-white group-hover:text-white">
              {wishlistItemCount}
            </span>
          </span>
          <span className="sr-only">
            {formatWishlistMessage({
              id: 'wishlist.items.in.view',
              defaultMessage: 'items in wishlist, view wishlist',
            })}
          </span>
        </>
      )}
      <DrawerComponent isOpen={showCart} setIsOpen={setShowCart}>
        <WishlistTastic data={data} />
      </DrawerComponent>
    </div>
  );
};

export default WishListButton;
