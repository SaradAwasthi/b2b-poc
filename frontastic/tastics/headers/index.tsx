import React from 'react';

import { calculateCartCount } from 'helpers/utils/calculateCartCount';
import { useCart, useWishlist, useAccount } from 'frontastic/provider';
import Header from 'components/commercetools-ui/Headers';

const HeaderTastic = ({ data }) => {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const { account } = useAccount();

  return (
    <Header
      tagline={data.tagline}
      links={data.links}
      cartItemCount={calculateCartCount(cart?.lineItems) || 0}
      wishlistItemCount={wishlist?.lineItems?.length || 0}
      logo={data.logo}
      logoLink={data.logoLink}
      account={account}
      accountLink={data.accountLink}
      wishlistLink={data.wishlistLink}
      cartLink={data.cartLink}
      data={data}
    />
  );
};

export default HeaderTastic;
