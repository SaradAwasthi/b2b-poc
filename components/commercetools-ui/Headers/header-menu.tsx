import React, { Fragment, useCallback } from 'react';
import NextLink from 'next/link';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useFormat } from 'helpers/hooks/useFormat';
import { useDarkMode } from 'frontastic';
import { Link } from './index';
import SearchButton from './algolia-search-button';

interface HeaderMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: any;
  links: Link[];
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ open, setOpen, navigation, links }) => {
  //Darkmode
  const { mode } = useDarkMode();

  //i18n messages
  const { formatMessage } = useFormat({ name: 'common' });

  const closeMenu = () => setOpen(false);
  // console.log('header menu');

  //Generates tab class name
  const tabClassName = useCallback((selected: boolean) => {
    return classNames(
      selected ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-900 dark:text-light-100 ',
      'flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium',
    );
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className={`${mode} fixed inset-0 z-40 flex lg:hidden`} onClose={closeMenu}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-25" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">{formatMessage({ id: 'menu.close', defaultMessage: 'Close menu' })}</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Links */}
            <Tab.Group>
              <div className="mt-2 border-b border-gray-200">
                <Tab.List className="flex flex-col px-2" onClick={closeMenu}>
                  {navigation.categories.map((category) => (
                    <Tab key={category.name} className={({ selected }) => tabClassName(selected)}>
                      <NextLink href={`/${category?.slug}`}>
                        <div className="text-left text-sm">{category.name}</div>
                      </NextLink>
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </Tab.Group>

            <div className="border-t border-gray-200 py-10">{/* <SearchButton /> */}</div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default HeaderMenu;
