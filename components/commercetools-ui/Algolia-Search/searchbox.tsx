import { useRouter } from 'next/router';
import { connectSearchBox } from 'react-instantsearch-dom';
export let searchProducts = [];
export let searchQueryText = '';
function SearchBox({ refine, style, placeHolder, searchOutput, endSearch, searchQuery, showbutton }) {
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(searchOutput);
    searchProducts = searchOutput?.hits;
    searchQueryText = searchQuery;
    router.push('/search-result');
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        className="border-[#6b728] mr-4 w-[16rem] rounded-md pl-14 text-black"
        type="search"
        placeholder={placeHolder}
        onChange={(e) => refine(e.currentTarget.value)}
        onBlur={endSearch && (() => endSearch())}
      />{' '}
      {showbutton && (
        <button type="submit" className="btn-search">
          Search
        </button>
      )}
    </form>
  );
}
export default connectSearchBox(SearchBox);
