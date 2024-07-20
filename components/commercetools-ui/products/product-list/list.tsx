import React from 'react';
import NextLink from 'next/link';
import { Product } from '@Types/product/Product';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import Image from 'frontastic/lib/image';
import WishlistButton from '../product-details/wishlist-button';

interface Props {
  products: Product[];
  filtering?: boolean;
}

const List: React.FC<Props> = ({ products, filtering }) => {
  //i18n messages
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });
  const attributes = [];
  const onAddToWishlist = () => {
    return null;
  };
  return (
    <div className="mx-auto w-full pt-8 pb-16 lg:pt-4">
      <h2 className="sr-only">{formatProductMessage({ id: 'products', defaultMessage: 'Products' })}</h2>
      {/* <div
        className={`grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${
          filtering ? '3' : '4'
        } xl:gap-x-8`}
      > */}
      <div className="flex flex-col justify-center">
        {products?.map((product) => (
          <NextLink href={product._url} key={product.productId}>
            <div className="group my-4">
              <div className="flex h-[15rem] flex-row justify-between rounded-lg bg-[#F9F9F9] drop-shadow-2xl">
                <div className="flex flex-row">
                  <Image src={product.variants[0].images[0]} alt={product.name} className="h-full w-96 object-cover" />
                  <div className="flex flex-col justify-start p-6">
                    <h3 className="mt-4 text-xl font-bold text-gray-700 dark:text-light-100">{product?.name}</h3>

                    <p className="pt-4 text-sm text-gray-900 dark:text-light-100">
                      <span className="font-bold">Version: </span>
                      {product?.version}
                    </p>

                    <p className="pt-2 text-sm text-gray-900 dark:text-light-100">
                      <span className="font-bold">Purity: </span>
                      {product?.variants[0]?.attributes?.Purity_Percentage}
                    </p>

                    <p className="pt-2 text-sm text-gray-900 dark:text-light-100">
                      <span className="font-bold">Produced In: </span>
                      {product?.variants[0]?.attributes?.Innovator_Brand}
                    </p>

                    <a href="#" className="mt-4 font-bold text-rc-brand-primary underline">
                      Know more {'>'}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-14">
                  <span className="pr-6">
                    <WishlistButton variant={product.variants[0]} onAddToWishlist={onAddToWishlist} />
                  </span>
                  <div className="dark:text-light-10 text-gray-90 mr-10 rounded-md bg-[#E5EEED] p-6 text-lg font-bold">
                    <p className="text-md font-normal">100 mg</p>
                    <p className="text-xl font-bold">{CurrencyHelpers.formatForCurrency(product.variants[0].price)}</p>
                  </div>
                </div>
              </div>
            </div>
          </NextLink>
        ))}
      </div>
    </div>
    // </div>
  );
};

export default List;
