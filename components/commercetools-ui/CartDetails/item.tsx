import React from 'react';
import { XIcon as XIconSolid } from '@heroicons/react/solid';
import { LineItem } from '@Types/cart/LineItem';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import Image from 'frontastic/lib/image';

interface Props {
  lineItem: LineItem;

  goToProductPage: (_url: string) => void;
  editItemQuantity: (lineItemId: string, newQuantity: number) => void;
  removeItem: (lineItemId: string) => void;
}

const Item = ({ lineItem, goToProductPage, editItemQuantity, removeItem }: Props) => {
  const { formatMessage } = useFormat({ name: 'common' });

  console.log(lineItem, 'productsproducts');

  return (
    <div className="flex items-center justify-center border-b-2 px-3 py-2 hover:shadow-lg">
      <div className="mr-2">
        <div className="">
          <button
            type="button"
            onClick={() => removeItem(lineItem.lineItemId)}
            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">{formatMessage({ id: 'remove', defaultMessage: 'Remove' })}</span>
            <XIconSolid className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <li className="mb-2 flex w-full flex-col rounded-md">
        <div className="shrink-0">
          <Image
            src={lineItem.variant.images[0]}
            alt={lineItem.name}
            className="hidden h-48 w-80 cursor-pointer rounded-md object-cover object-center lg:block"
            onClick={() => goToProductPage(lineItem._url)}
          />
        </div>

        <div className="ml-6 flex flex-1 flex-col">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg">
                <p
                  className="cursor-pointer pt-2 font-bold text-gray-700"
                  onClick={() => goToProductPage(lineItem._url)}
                >
                  {lineItem.name}
                </p>
              </h3>
              <div className="rounded-md py-3 text-lg font-bold text-gray-900">
                <p className="pt-2 text-sm text-gray-900 dark:text-light-100">
                  <span className="font-normal">Quantity: </span>
                  {lineItem?.count}
                </p>

                <p className="text-lg font-bold text-primary-100 lg:text-xl">
                  {CurrencyHelpers.formatForCurrency(lineItem.totalPrice)}
                </p>
              </div>

              {/* <a href="#" className="font-bold text-blue-400 underline">
                Move to wishlist
              </a> */}
              {/* <div className=" h-8 w-28 pt-2 md:pt-24">
              <div className="relative mt-1 flex h-8 w-full flex-row rounded-lg bg-transparent">
                <button
                  type="button"
                  onClick={() => {
                    editItemQuantity(lineItem.lineItemId, lineItem.count - 1);
                  }}
                  disabled={lineItem.count <= 1 ? true : false}
                  className={`h-full w-20 cursor-pointer ${
                    lineItem.count <= 1 ? 'cursor-not-allowed' : 'cursor-pointer'
                  } rounded-l bg-gray-300 text-gray-900 outline-none hover:bg-gray-400 disabled:opacity-50`}
                >
                  <span className="m-auto text-2xl font-thin">−</span>
                </button>
                <div className="flex w-full items-center justify-center bg-gray-300 text-center text-base font-semibold text-gray-800  outline-none hover:text-black focus:text-black  focus:outline-none">
                  {lineItem.count}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    editItemQuantity(lineItem.lineItemId, lineItem.count + 1);
                  }}
                  disabled={lineItem.variant.isOnStock ? false : true}
                  className={`h-full w-20 cursor-pointer ${
                    lineItem.variant.isOnStock ? 'cursor-pointer' : 'cursor-not-allowed'
                  } rounded-r bg-gray-300 text-gray-900 hover:bg-gray-400`}
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div> */}
            </div>

            {/* <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="absolute top-0 right-0">
              <button
                type="button"
                onClick={() => removeItem(lineItem.lineItemId)}
                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{formatMessage({ id: 'remove', defaultMessage: 'Remove' })}</span>
                <XIconSolid className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div> */}
          </div>
        </div>
      </li>
    </div>
  );
};

export default Item;
