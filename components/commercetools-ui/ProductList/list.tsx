import React, { useState } from 'react';
import NextLink from 'next/link';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import Image from 'frontastic/lib/image';

interface Props {
  products: Product[];
  filtering?: boolean;
  gridView: boolean;
  onAddToCart: (variant: Variant, quantity: number) => Promise<void>;
}

const List: React.FC<Props> = ({ products, filtering, gridView, onAddToCart }) => {
  //i18n messages
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });
  const attributes = [];
  const [discountedPrice, setdiscountedPrice] = useState(products[0]?.variants[0]?.discountedPrice?.centAmount || 0);
  const [totalPrice, setttlPrice] = useState(products[0]?.variants[0]?.price?.centAmount || 0);

  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  // console.log(products, 'productslisrt');
  // console.log(products[0]?.variants[0]?.discountedPrice?.centAmount);

  // console.log(discountedPrice, 'discountedPrice');
  // console.log(totalPrice, 'ttlPrices');

  // const percentChange = ((totalPrice - discountedPrice) / totalPrice) * 100;
  // console.log('percentChange', percentChange);

  // return (
  return (
    <div className="w-full border-t-2 border-gray-100 pl-2 pt-8 pb-16 lg:pt-4">
      <h2 className="sr-only">{formatProductMessage({ id: 'products', defaultMessage: 'Products' })}</h2>

      <div
        className={
          gridView
            ? 'grid grid-cols-1 gap-10 md:grid-cols-3'
            : 'flex w-full flex-col justify-center gap-2'
        }
      >
        {products?.map((product) => {
          const variant = product.variants[0];
          const variantDiscountedPrice = variant.discountedPrice?.centAmount || variant.price?.centAmount || 0;
          const variantPrice = variant.price?.centAmount || 0;

          // Calculate percentChange based on whether there is a discount or not
          const percentChange =
            variantDiscountedPrice < variantPrice ? ((variantPrice - variantDiscountedPrice) / variantPrice) * 100 : 0;
          // console.log(percentChange, 'percentChange');

          // console.log('variantDiscountedPrice', variantDiscountedPrice);
          // console.log('variantPrice', variantPrice);
          // console.log('products', products);

          return (
            <NextLink href={product._url} key={product.productId}>
              <div>
                <div className="each-section">

                  <div
                    className={
                      gridView
                        ? 'flex flex-row justify-between rounded-lg border-[1px] p-6'
                        : 'flex flex-row justify-between rounded-lg py-4 border-[1px] px-12'
                    }
                  >
                    <div className={gridView ? 'flex flex-col justify-center w-full' : 'flex flex-row justify-center items-center'}>
                      {/* {percentChange > 0 && <div className="text-base font-normal text-gray-500">{percentChange}%</div>} */}
                      <div className={gridView ? 'h-full w-full' : ''}>
                        <Image
                          src={variant.images[0]}
                          alt={product.name}
                          style={{ objectFit: 'contain' }}
                          className={
                            gridView
                              ? 'w-full overflow-hidden object-contain max-h-[12rem]'
                              : 'hidden h-full object-cover md:block md:w-48 mr-24 max-h-[12rem]'
                          }
                        />
                      </div>

                      {gridView ? (
                        <div className="flex flex-col justify-between items-center py-5 px-2">
                          <h3 className="text-lg font-normal text-gray-700">{product?.name}</h3>
                          {percentChange > 0 && (
                            <div className="text-sm my-2 font-normal text-gray-500">{percentChange.toFixed(2)}% off</div>
                          )}

                          <div className='flex w-full justify-center items-center py-2 flex-col'>
                            {variant.discountedPrice ? (
                              <p className="lg:text-l pr-1 text-base font-bold line-through">
                                {/* Display the original price */}
                                {CurrencyHelpers.formatForCurrency(variant.price)}
                              </p>
                            ) : null}

                            {
                              product.variants[0]?.offers ?
                                <div className='my-2'>{product.variants[0]?.offers[0]?.price}&nbsp;<span>USD</span></div> :
                                CurrencyHelpers.formatForCurrency(variant.discountedPrice || variant.price)
                            }
                          </div>
                          <button className="mt-auto w-fit py-2 px-6 rounded-lg bg-rc-brand-primary text-base text-white hover:opacity-80">
                            Know More
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start justify-start p-3">
                          <h3 className="my-4 w-64 truncate text-xl font-bold text-gray-700">{product?.name}</h3>
                          {/* {percentChange > 0 && (
                          <div className="text-base font-normal text-gray-500">{percentChange}% off</div>
                        )} */}
                          {percentChange > 0 && (
                            <div className="text-base font-bold lg:text-xl">
                              {/* <span className="pr-1 line-through"> */}
                                {/* Display the original price */}
                                {/* {CurrencyHelpers.formatForCurrency(variant.price)} */}
                              {/* </span> */}
                              {/* Display the discounted price */}
                              {/* {CurrencyHelpers.formatForCurrency(variant.discountedPrice)} */}
                            </div>
                          )}

                            
                          <div className='max-w-[640px]'>
                              <p>{product?.description}</p>
                            </div>
                          {percentChange > 0 && (
                            <div className="text-base my-4 font-normal text-gray-500">{percentChange.toFixed(2)}% off</div>
                          )}
                          <button className="mt-auto w-fit py-2 px-6 rounded-lg bg-rc-brand-primary text-base text-white hover:opacity-80">
                            Know More
                          </button>
                        </div>
                      )}
                    </div>
                    {!gridView && (
                      <div className="flex flex-col items-end justify-between py-6 px-4">
                        {/* <div className="text-gray-90 rounded-md text-base font-bold lg:text-lg">
                        <p className="text-base font-bold lg:text-xl">
                          
                          {CurrencyHelpers.formatForCurrency(variant.price || variant.discountedPrice)}
                        </p>
                      </div> */}
                        <div>
                          {/* {products?.price?.centAmount != 0 ? (
                            <div className="ml-[10px] text-[28px] text-[#303030] sm:font-bold lg:ml-[10px] lg:font-bold 2xl:ml-[10px]">
                              {CurrencyHelpers.formatForCurrency(product?.price)}/unit
                            </div>
                          ) : (
                            <button className="first_review flex lg:mt-[8px]" onClick={requestForQuote}>
                              Ask for price
                            </button>
                          )} */}
                          {/* {variant.discountedPrice ? (
                            <span className="pr-1 line-through">
                              {CurrencyHelpers.formatForCurrency(variant.price)}
                            </span>
                          ) : null}
                          <p className="text-base font-bold lg:text-xl">
                            {' '}
                            {CurrencyHelpers.formatForCurrency(variant.discountedPrice || variant.price)}
                          </p> */}

                          {variant.discountedPrice ? (
                            <p className="lg:text-l pr-1 text-base font-bold line-through">
                              {/* Display the original price */}
                              {CurrencyHelpers.formatForCurrency(variant.price)}
                            </p>
                          ) : null}
                          <div className="text-base font-bold lg:text-xl">
                            {/* if Discounted Price is available then disounted price will display otherwise original price will display */}
                            {
                              product.variants[0]?.offers ?
                                <div>{product.variants[0]?.offers[0]?.price}&nbsp;<span>USD</span></div> :
                                CurrencyHelpers.formatForCurrency(variant.discountedPrice || variant.price)
                            }


                            {/* {CurrencyHelpers.formatForCurrency(variant.discountedPrice || variant.price)} */}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="each-hover-effect"></div>
              </div>
            </NextLink>
          );
        })}
      </div>
    </div>
  );
};

export default List;
