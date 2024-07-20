// components/search.js
// import algoliasearch from 'algoliasearch/lite';
// import { useState } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import SearchBox from './searchbox';
import SearchHits from './searchits';
import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';

interface SearchProps {
  searchInputStyle?: string;
  placeHolder?: string;
  endSearch?: any;
  showbutton?: boolean;
}
const searchClient = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_APPLICATION_KEY);
const index = searchClient.initIndex(process.env.ALGOLIA_INDEX_NAME);
export default function AlgoliaSearch({ searchInputStyle, placeHolder, endSearch, showbutton }: SearchProps) {
  const [searchOutput, setSearchOutput] = useState([]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if (searchTerm === '') {
      setSearchOutput([]);
      return;
    }
  }, []);
  return (
    <div className="relative">
      <InstantSearch searchClient={searchClient} indexName={process.env.ALGOLIA_INDEX_NAME}>
        <SearchBox
          style={searchInputStyle}
          placeHolder={placeHolder}
          searchOutput={searchOutput}
          endSearch={endSearch}
          searchQuery={searchQuery}
          showbutton={showbutton}
        />
        <SearchHits setSearchOutput={setSearchOutput} setSearchQuery={setSearchQuery} />
      </InstantSearch>
    </div>
  );
}
