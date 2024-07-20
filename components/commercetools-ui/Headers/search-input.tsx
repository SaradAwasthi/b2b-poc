import React, { useEffect, useRef } from 'react';
import { useFormat } from 'helpers/hooks/useFormat';

export interface Props extends React.ComponentProps<'input'> {
  onSubmit?: () => void;
}

const SearchInput: React.FC<Props> = ({ onSubmit, ...props }) => {
  //formatted messages
  const { formatMessage } = useFormat({ name: 'common' });

  //input ref
  const ref = useRef<HTMLInputElement>(null);

  //form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  useEffect(() => {
    //upon mounting we initially focus the input
    ref.current.focus();
  }, []);

  return (
    <form
      className="relative top-[65px] left-0 z-40 flex w-full items-center border bg-light-100 p-5 md:absolute md:top-1/2 md:right-0 md:left-[unset] md:w-[20rem] md:-translate-y-1/2 md:p-0 md:shadow-none"
      onSubmit={handleSubmit}
    >
      <div className="ml-3">
        <svg
          aria-hidden="true"
          className="h-6 w-6 text-gray-900 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <label htmlFor="email" className="sr-only">
        Search
      </label>
      <input
        type="text"
        name="search"
        id="search"
        className="border-transparent focus:border-transparent focus:ring-0"
        placeholder={`${formatMessage({ id: 'search', defaultMessage: 'Type here to search' })}...`}
        {...props}
        ref={ref}
      />
    </form>
  );
};

export default SearchInput;
