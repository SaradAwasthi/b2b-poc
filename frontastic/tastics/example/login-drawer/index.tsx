import React from 'react';
import { XIcon as XIconSolid } from '@heroicons/react/solid';

export default function LoginDrawerComponent({ children, isOpen, setIsOpen, showLogin, setShowLogin }) {
  return (
    <main
      className={
        'fixed right-0 top-0 z-50 h-full w-full bg-gray-900 bg-opacity-75' +
        (isOpen
          ? ' block opacity-100 transition-opacity duration-500  '
          : ' hidden opacity-0 transition-all delay-500  ')
      }
    >
      <section
        className={
          ' delay-400 mx-auto mt-20 max-w-lg bg-white shadow-xl transition-all duration-500 ease-in-out  ' +
          (isOpen ? ' block ' : ' hidden')
        }
      >
        <article className="relative flex h-0 w-screen max-w-lg flex-col">
          <button
            className="absolute right-4 top-3 font-extrabold text-gray-300 hover:text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            <XIconSolid className="h-7 w-7" aria-hidden="true" />
          </button>

          {children}
          {/* <button onClick={() => setShowLogin(!showLogin)} className="underline hover:text-primary-100 mt-2">
            {!showLogin ? 'Login to your account' : 'Register today'}
          </button> */}
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
