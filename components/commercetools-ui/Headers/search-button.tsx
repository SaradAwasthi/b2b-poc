import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';
import { SearchIcon } from '@heroicons/react/outline';
import SearchInput from './search-input';
import AlgoliaSearch from '../Algolia-Search/search-algolia';
// import AlgoliaSearch from '../products/product-list/algolia_search/search-algolia';

function useOutsideAlerter(ref, endSearch) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        endSearch();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
const SearchButton: React.FC = () => {
  //next/router
  const { asPath } = useRouter();

  //show search input
  const [searching, setSearching] = useState(false);

  const startSearch = () => setSearching(true);

  const endSearch = () => setSearching(false);

  

  //input value
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    endSearch();
  }, [asPath]);

  const searchWrapperRef = useRef(null);
  useOutsideAlerter(searchWrapperRef, endSearch);
  useEffect(() => {
    endSearch();
  }, [asPath]);

  return (
    <div className="headerSearchMain relative flex">
      <Transition
        show={!searching}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="cursor-pointer dark:text-light-100" onClick={startSearch}>
          <span className="sr-only">Search</span>

          <svg
            className="accountbutton rounded-lg mt-1 ml-10 text-base text-primary-100 decoration-2 duration-300 hover:underline"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.0004 21L16.6504 16.65"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Transition>
      <Transition
        show={searching}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {/* <SearchInput onBlur={endSearch} value={searchValue} onChange={handleChange} onSubmit={handleSubmit} /> */}
        <div ref={searchWrapperRef}>
          <AlgoliaSearch searchInputStyle={'search_Input'} placeHolder={'Search by Product name'} />
          <svg
            className="absolute top-2 left-3 w-8 h-15"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#003769"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.0004 21L16.6504 16.65"
              stroke="#003769"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Transition>
    </div>
  );
};

export default SearchButton;
