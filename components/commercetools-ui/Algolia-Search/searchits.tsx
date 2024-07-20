// components/search-hits.js
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { connectStateResults } from 'react-instantsearch-dom';
import router, { useRouter } from 'next/router';

function useOutsideAlerter(ref, setHideSearchDropdown) {
  const handleClickOutside = (event) => {
    if (ref?.current && !ref.current?.contains(event.target)) {
      setHideSearchDropdown = true;
    }
  };
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    // function handleClickOutside(event) {
    //   if (ref.current && !ref.current.contains(event.target)) {
    //     setHideSearchDropdown(true);
    //   }
    // }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

function SearchHits({
  searchState,
  searchResults,
  setSearchOutput,
  setSearchQuery,
  setHideSearchDropdown,
  hideSearchDropdown,
}) {
  const { asPath } = useRouter();
  // checking if the query length is >= 3
  // (since 3 is the minimum Algolia query length)
  const [slicedHits, setSlicedHits] = useState([]);

  const [recentSearches, setRecentSearches] = useState([]);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setHideSearchDropdown);
  const [categoryMatches, setCategoryMatches] = useState([
    {
      name: '',
      slug: '',
    },
  ]);
  const getCategories = (searchResults, searchState) => {
    const allCategories = searchResults?.hits[0]?.productProjections?.categories[0].obj.ancestors;
    const categoryNames = [];
    if (Object.keys(searchState).length > 0 && allCategories) {
      allCategories.forEach((element) => {
        categoryNames.push({
          name: element.obj.name['en-GB'].toLowerCase(),
          slug: element.obj.slug['en_GB'],
        });
      });
      categoryNames.splice(0, 1);
      setCategoryMatches(categoryNames);
    }
  };
  useEffect(() => {
    //console.log(categoryMatches);
    getCategories(searchResults, searchState);
    setSlicedHits(searchResults?.hits.slice(0, 3));
    setSearchOutput(searchResults);
    setSearchQuery(searchState.query);
  }, [searchResults, searchState]);
  useEffect(() => {
    searchState.query = '';
  }, [asPath]);

  const addRecentSearches = (query) => {
    if (typeof window !== 'undefined') {
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      if (recentSearches.length > 5) {
        recentSearches.splice(-1);
      }

      recentSearches.unshift(query);
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    addRecentSearches(query);
    setHideSearchDropdown(true);
    router.push('/search?q=' + query);
  };
  const validQuery = searchState.query?.length >= 1;
  return searchState.query && !hideSearchDropdown && validQuery ? (
    <>
      <div
        className="search_popup absolute z-10 w-[20rem] rounded-md border-r-2 bg-[#f9f9f9] py-1 px-5 shadow-lg"
        ref={wrapperRef}
      >
        {searchResults?.hits?.length === 0 && <div className="search-items-heading pt-2">No results found!</div>}

        {searchResults?.hits?.length > 0 &&
          slicedHits?.map((hit) => (
           
            <div key={hit?.objectID} className="search-items">
              {/* {console.log("Algolia Search : ",hit)} */}
              <span>
                <p
                  className="search-items-heading hover:cursor-pointer hover:underline"
                  onClick={() => handleRecentSearchClick(hit.productProjections?.name['en-GB'])}
                >
                  {hit.productProjections?.name['en-GB']}
                </p>
                <div className="my-2 flex items-center text-base text-black">
                  {/* <img className="mr-4 h-10 object-cover" src={hit?.variants[0]?.images[0]} alt="product image" /> */}
{                  console.log("Hit", hit)}
                  {
                    <Link href={`${hit?.slug && hit?.slug['en-GB']}/p/${hit?.masterVariant?.sku}`}>
                      <a className="hover:underline">{hit?.name && hit?.name['en-GB']}</a>
                    </Link>
                  }
                  {/**/}
                  {/**/}
                </div>
              </span>
            </div>
          ))}

        {searchResults?.hits.length > 0 &&
          categoryMatches.map((item) => (
            <div key={item.name} className="my-2 text-lg leading-snug">
              <Link href={`/${item.slug}`}>
                <a className="capitalize hover:underline">{item.name}</a>
              </Link>
            </div>
          ))}
      </div>
    </>
  ) : null;
}
export default connectStateResults(SearchHits);
