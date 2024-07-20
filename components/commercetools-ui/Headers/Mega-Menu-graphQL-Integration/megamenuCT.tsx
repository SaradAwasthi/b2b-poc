//megamenuCT.tsx

import { Popover, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Typography from 'components/commercetools-ui/typography';
import MegaMenuContent from '../mega-menu-content';
import NextLink from 'next/link';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function MegaMenu({ MegaMenuData }) {
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [openedCategory, setOpenedCategory] = useState(null);

  let lastScrollTop = 0;
  const heightToHideFrom = 100;
  useEffect(() => {
    window.addEventListener(
      'scroll',
      function () {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop && st > heightToHideFrom) {
          setIsVisible(false);
        } else if (st < lastScrollTop) {
          setIsVisible(true);
        }
        lastScrollTop = st <= 0 ? 0 : st;
      },
      false,
    );
  }, []);
  const handleCategoryClick = (categoryIdx) => {
    if (openedCategory === categoryIdx) {
      setOpenedCategory(null); // Close the currently opened category if clicked again
    } else {
      setOpenedCategory(categoryIdx); // Open the clicked category
    }
  };
  // console.log('MEGAMENU DATA', MegaMenuData);

  return (
    <div className="headerMegaMain flex items-center justify-between">
      {/* Mega menus */}
      <Popover.Group className="hidden lg:block lg:flex-1 lg:self-stretch">
        <div className="ml-4 flex h-full items-center space-x-8">
          {MegaMenuData &&
            MegaMenuData.categories.results.map((category, categoryIdx) => (
              <div key={category.name} className="relative">
                {category.children.length > 0 ? (
                  <div className="dropdown ">
                    <button
                      className="dropbtn rounded-lg text-base font-bold text-light-100 transition-colors duration-200 ease-out hover:underline hover:opacity-80 md:text-sm"
                      onClick={() => handleCategoryClick(categoryIdx)}
                    >
                      {category.name}
                    </button>
                    <div
                      className="dropdown-content absolute top-full left-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-md"
                      style={{ display: openedCategory === categoryIdx ? 'block' : 'none' }}
                    >
                      <ul className="m-0 list-none p-0">
                        {category.children.map((subCategory, index) => (
                          <li key={index}>
                            <NextLink href={subCategory.slug}>
                              <a className="dropdown-item block py-2 px-4 text-gray-800 hover:bg-gray-100">
                                {subCategory.name}
                              </a>
                            </NextLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <NextLink key={category.slug} href={`/${category.slug}`}>
                    <a className="text-base font-bold text-light-100 transition-colors duration-200 ease-out hover:underline hover:opacity-80 md:text-sm">
                      {category.name}
                    </a>
                  </NextLink>
                )}
              </div>
            ))}
        </div>
      </Popover.Group>
    </div>
  );
}

export default MegaMenu;
