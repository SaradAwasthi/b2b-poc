import React from 'react';
import { XIcon as XIconSolid } from '@heroicons/react/solid';

export default function DrawerComponent({ children, isOpen, setIsOpen }) {
  return (
    <main
      className={
        ' fixed inset-0 z-50 transform overflow-hidden bg-gray-900 bg-opacity-50 ease-in-out ' +
        (isOpen
          ? ' translate-x-0 opacity-100 transition-opacity duration-500  '
          : ' translate-x-full opacity-0 transition-all delay-500  ')
      }
    >
      <section
        className={
          ' delay-400 absolute right-0 h-full w-screen max-w-lg transform bg-white shadow-xl transition-all duration-500 ease-in-out  ' +
          (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
        }
      >
        <article className="relative flex h-full w-screen max-w-lg flex-col overflow-y-scroll overflow-hidden pb-10">
          <button
            className="absolute right-0 top-5 pr-10 font-extrabold text-gray-300 hover:text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            <XIconSolid className="h-7 w-7" aria-hidden="true" />
          </button>

          {children}
        </article>
      </section>
      <section
        className=" h-full w-screen cursor-pointer "
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
}
