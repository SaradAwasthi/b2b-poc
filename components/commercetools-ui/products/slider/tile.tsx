import React from 'react';
import NextLink from 'next/link';
import { Product } from '@Types/product/Product';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import Image from 'frontastic/lib/image';
import { products } from 'helpers/mocks/mockData';

const Tile: React.FC<Product> = ({ ...products }) => {
  // console.log("Pro : ", products);
  return (
      //  <h1>Hello</h1> 
    <NextLink href={products._url}>
      <a className="relative w-full">
        <Image src={products.variants[0].images[0]} alt={products.name} className="h-90 rounded-lg w-full object-cover group-hover:opacity-75" />
        <div>
          <h3 className="mt-4 overflow-hidden truncate text-sm font-bold text-gray-700 dark:text-light-100">{products.name}</h3>
          <p className="text-md text-gray-900 dark:text-light-100">
            {CurrencyHelpers.formatForCurrency(products.variants[0].price)}
          </p>
        </div>
      </a>
    </NextLink>
  );
};

export default Tile;
