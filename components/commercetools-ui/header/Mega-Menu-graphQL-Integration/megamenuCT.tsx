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

  // console.log('MEGAMENU DATA', MegaMenuData);

  return (
    <div className="headerMegaMain flex items-center justify-between">
      {/* Mega menus */}
      <Popover.Group className="hidden lg:block lg:flex-1 lg:self-stretch">
        <div className="ml-4 flex h-full items-center space-x-8">
          {MegaMenuData &&
            MegaMenuData.categories.results.map((category, categoryIdx) => (
              <>
                {category.children.length > 0 ? (
                  <div className="dropdown">
                    <button className="dropbtn rounded-lg text-base font-bold text-gray-400 transition-colors duration-200 ease-out hover:underline hover:opacity-80 md:text-sm">
                      {category.name}
                    </button>
                    <div className="dropdown-content rounded-lg">
                      {category.children.map((subCategory, index) => (
                        <NextLink href={subCategory.slug} key={index}>
                          <a className="dropdown-item rounded-lg">{subCategory.name}</a>
                        </NextLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Popover key={category.name} className="">
                    {({ open }) => (
                      <>
                        <div className="">
                          <NextLink href={`/${category?.slug}`}>
                            <button
                              className={classNames(
                                open ? 'border-indigo-600 text-gray-400' : 'border-transparent text-gray-400',
                                'relative z-10 -mb-px pt-px text-base font-bold transition-colors duration-200 ease-out hover:underline hover:opacity-80 md:text-sm',
                              )}
                            >
                              <Typography>{category.name}</Typography>
                            </button>
                          </NextLink>
                        </div>
                      </>
                    )}
                  </Popover>
                )}
              </>
            ))}
        </div>
      </Popover.Group>
    </div>
  );
}

export default MegaMenu;
