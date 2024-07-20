import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
import { Facet } from '@Types/result/Facet';
import Breadcrumb from 'components/commercetools-ui/breadcrumb';
import Filters from 'components/commercetools-ui/filters';
import FilterIcon from 'components/icons/filter';
import CloseIcon from 'components/icons/icon-x';
import { useFormat } from 'helpers/hooks/useFormat';
import { updateURLParams } from 'helpers/utils/updateURLParams';
import List from './list';
import SubCategories from './sub-category.index';
// import AlgoliaSearch from './algolia_search/search-algolia';

// import List from './List';
export interface Props {
  products: Product[];
  previousCursor: string;
  nextCursor: string;
  category: string;
  facets: Facet[];
  totalProducts: number;
  onAddToCart: (variant: Variant, quantity: number) => Promise<void>;
}

export default function ProductList({
  products,
  totalProducts,
  previousCursor,
  nextCursor,
  category,
  facets,
  onAddToCart,
}: Props) {
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [previousPageURL, setPreviousPageURL] = useState<string>('/');
  const [nextPageURL, setNextPageURL] = useState<string>('/');
  const [gridView, setGridView] = useState(false);

  //i18n messages
  const { formatMessage } = useFormat({ name: 'common' });
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const activeButtonClassName =
    'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50';

  const disabledButtonClassName = 'pointer-events-none rounded bg-gray-500 py-2 px-4 font-bold text-white opacity-50';

  const toggleFiltering = () => {
    setIsFiltering(!isFiltering);
  };

  useEffect(() => {
    if (previousCursor) {
      setPreviousPageURL(updateURLParams([{ key: 'cursor', value: previousCursor }]));
    }

    if (nextCursor) {
      setNextPageURL(updateURLParams([{ key: 'cursor', value: nextCursor }]));
    }
  }, [previousCursor, nextCursor]);

  return (
    <div className="mt-10 lg:px-6">
      {category && <Breadcrumb Separator="/">{category.split('/')}</Breadcrumb>}
      {/* <div className="flex">
        <AlgoliaSearch searchInputStyle={'search_input'} placeHolder={'Search'} />
      </div> */}
      <div className="mt-8 flex justify-between gap-16">
        {isFiltering ? (
          <button onClick={toggleFiltering} className="w-full py-2">
            <div className="flex justify-between">
              <h6 className="text-base font-bold text-neutral-700 dark:text-light-100">
                {formatProductMessage({ id: 'sortAndFilter', defaultMessage: 'Sort & Filter' })}
              </h6>
              <CloseIcon className="h-6 w-5 fill-neutral-700 dark:fill-light-100" />
            </div>
          </button>
        ) : (
          <button onClick={toggleFiltering} className="flex w-full justify-between py-2">
            <div className="flex gap-1">
              <FilterIcon className="h-6 w-5 fill-neutral-700 dark:fill-light-100" />
              <h6 className="text-base font-bold text-neutral-700 dark:text-light-100">
                {formatProductMessage({ id: 'sortAndFilter', defaultMessage: 'Sort & Filter' })}
              </h6>
            </div>

            <h6 className="block text-right dark:text-light-100 lg:hidden">
              {`${products?.length} ${formatProductMessage({ id: 'items', defaultMessage: 'Items' })}`}
            </h6>
          </button>
        )}



        {/* <h6 className="col-span-2 hidden text-right dark:text-light-100 lg:block">
          {`${products?.length} ${formatProductMessage({ id: 'items', defaultMessage: 'Items' })} ${totalProducts}`}
        </h6> */}



        <div className="flex flex-row items-center justify-center gap-2 py-3 lg:gap-4">
          <h6>View: </h6>
          <button
            onClick={() => setGridView(true)}
            className="rounded-full bg-primary-100 py-2 px-4 text-sm text-white duration-300 hover:bg-gray-100 hover:text-black hover:drop-shadow-md lg:px-6"
          >
            Grid
          </button>
          <button
            onClick={() => setGridView(false)}
            className="rounded-full bg-primary-100 py-2 px-4 text-sm text-white duration-300 hover:bg-gray-100 hover:text-black hover:drop-shadow-md lg:px-6"
          >
            Column
          </button>
        </div>
      </div>

      {isFiltering ? (
        <div className="mt-2 gap-16"> 
          <div className="">
            <Filters facets={facets} products={products} />
          </div>
          <div className="">
            {products.length > 0 ? (
              <div className="flex">
                <SubCategories category={category} />
                <List products={products} filtering={isFiltering} gridView={gridView} onAddToCart={onAddToCart} />
              </div>
            ) : (
              <p>{formatProductMessage({ id: 'noProductsFound', defaultMessage: 'No products found.' })}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex">
          <SubCategories category={category} />
          <List products={products} gridView={gridView} onAddToCart={onAddToCart} />
        </div>
      )}

      <nav
        className="flex items-center justify-between border-t border-gray-200 py-3 px-4 sm:px-6"
        aria-label="Pagination"
      >
        <div className="flex flex-1 justify-between gap-x-1.5 sm:justify-end">
          <NextLink href={previousPageURL}>
            <a className={previousCursor ? activeButtonClassName : disabledButtonClassName}>
              {formatMessage({ id: 'prev', defaultMessage: 'Previous' })}
            </a>
          </NextLink>
          <NextLink href={nextPageURL}>
            <a className={nextCursor ? activeButtonClassName : disabledButtonClassName}>
              {formatMessage({ id: 'next', defaultMessage: 'Next' })}
            </a>
          </NextLink>
        </div>
      </nav>
    </div>
  );
}
