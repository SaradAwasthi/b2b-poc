import React from 'react';
import { XIcon as XIconSolid } from '@heroicons/react/solid';
import { LineItem } from '@Types/cart/LineItem';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { StringHelpers } from 'helpers/stringHelpers';
import Image from 'frontastic/lib/image';

interface Props {
  lineItem: LineItem;
  goToProductPage: (_url: string) => void;
  editItemQuantity: (lineItemId: string, newQuantity: number) => void;
  removeItem: (lineItemId: string) => void;
}

const Item = ({ lineItem, goToProductPage, editItemQuantity, removeItem }: Props) => {
  const { formatMessage } = useFormat({ name: 'common' });

  return (
    <div className="flex items-center justify-center my-6 p-4 border-2 rounded-md">
      <li className="mb-4 flex gap-4 w-full justify-center items-center">
        <div className="shrink-0 flex justify-center">
          <Image
            src={lineItem.variant.images[0]}
            alt={lineItem.name}
            className="h-40 w-40 cursor-pointer rounded-md object-cover object-center"
            onClick={() => goToProductPage(lineItem._url)}
          />
        </div>

        <div className="flex flex-1 flex-col py-4">
          <div className="flex flex-col items-start justify-between">
            <div>
              <h3 className="text-lg">
                <p
                  className="cursor-pointer font-bold text-gray-700 dark:text-light-100"
                  onClick={() => goToProductPage(lineItem._url)}
                >
                  {lineItem.name}
                </p>
              </h3>

              <p className="pt-2 text-md text-gray-900 dark:text-light-100">
                <span className="font-bold">Quantity: </span>
                {lineItem?.count}
              </p>
            </div>

            <div className="w-full flex flex-col items-start justify-center my-2 rounded-md text-md font-bold text-gray-900 dark:text-light-100">
              <p className="text-md font-bold">{CurrencyHelpers.formatForCurrency(lineItem.price)}</p>
            </div>
          </div>    
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => removeItem(lineItem.lineItemId)}
              className="py-1 px-6 my-2 w-fit rounded-md border-[1px] hover:bg-rc-brand-primary hover:text-white border-rc-brand-primary text-gray-400 hover:text-gray-500 flex items-center"
            >
              <span className="sr-only">{formatMessage({ id: 'remove', defaultMessage: 'Remove' })}</span>
              Remove 
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Item;
