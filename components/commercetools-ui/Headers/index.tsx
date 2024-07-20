import React, { Fragment, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { MenuIcon } from '@heroicons/react/outline';
import { Account } from '@Types/account/Account';
import Typography from 'components/commercetools-ui/typography';
import { headerNavigation } from 'helpers/mocks/mockData';
import { Reference, ReferenceLink } from 'helpers/reference';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';
import DarkModeWidget from '../darkmode-widget';
import AccountButton from './account-button';
import CartButton from './cart-button';
import HeaderMenu from './header-menu';
import { useQuery } from '@apollo/client';
import SearchButton from './search-button';
import WishListButton from './wishlist-button';
import Link from 'next/link';
import MegaMenu from './Mega-Menu-graphQL-Integration/megamenuCT';
import { LOAD_MEGAMENU_DATA } from './Mega-Menu-graphQL-Integration/mega-menu-graphql';
import { apolloClient } from 'pages/_app';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export interface Link {
  name: string;
  reference: Reference;
}

export interface HeaderProps {
  tagline?: string;
  links: Link[];
  cartItemCount: number;
  wishlistItemCount?: number;
  logo: { media: NextFrontasticImage } | NextFrontasticImage;
  logoLink: Reference;
  account: Account;
  accountLink: Reference;
  wishlistLink?: Reference;
  cartLink: Reference;
  data: unknown;
}

const Header: React.FC<HeaderProps> = ({
  tagline,
  links,
  cartItemCount,
  wishlistItemCount,
  logo,
  logoLink,
  account,
  accountLink,
  wishlistLink,
  cartLink,
  data,
}) => {
  const [open, setOpen] = useState(false);
  const [megaMenuData, setMegaMenuData] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
   const [isButtonClicked, setIsButtonClicked] = useState(false);

  const detectCategoriesClick = () => {
    const checkMenu = window.localStorage.getItem('showSideMenu');
    if (checkMenu === 'true') {
      window.localStorage.removeItem('showSideMenu');
      setOpen(true);
    }
  };
  const getData = async () => {
    console.log('hi');
    apolloClient
      .query({
        query: LOAD_MEGAMENU_DATA,
      })
      .then((response) => {
        console.log('RESPONSE IN INDEX.TSX HEADERS', response);
        sessionStorage.setItem('megamenu-data', JSON.stringify(response.data));
        setMegaMenuData(response.data);
      });
  };
  // console.log('Getaaa Data', megaMenuData);

  //   const { loading, error, data } = useQuery(LOAD_MEGAMENU_DATA);
  useEffect(() => {
    const isData = JSON.parse(window.sessionStorage.getItem('megamenu-data'));
    if (isData) {
      setMegaMenuData(isData);
    } else {
      getData();
    }
    window.addEventListener('storage', detectCategoriesClick);

    return () => {
      window.removeEventListener('storage', detectCategoriesClick);
    };
  }, []);

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

const handleButtonClick = () => {
    setIsButtonClicked(true);
  };

  return (
    <div className="flex w-full">
      {/* Mobile menu */}

      <HeaderMenu open={open} setOpen={setOpen} links={links} navigation={headerNavigation} />

      <header className="w-full">
        {tagline && (
          <p className="flex items-center justify-center bg-primary-400 px-4 text-base font-medium text-gray-400 sm:px-6 lg:px-8">
            <Typography>{tagline}</Typography>
          </p>
        )}

        <nav aria-label="Top" className="order-gray-200 mx-auto max-w-full border-b bg-rc-brand-primary px-6 lg:px-8 lg:pl-0">
          {/* Secondary navigation */}
          {/* <div className="header-link">
            <div className="header-link-left">
              <a href="#" >A&F Link 1 </a>
              <a href="#" > Link1 </a>
            </div>
            
            <div className="header-link-right">  <a href="#" >Sign In or Create Account </a></div>
          
        </div> */}
          {/* <div className="topHalf top-header">
           
           <SearchButton /> 
        </div> */}
          <div className="top-header-container h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center lg:hidden">
                <button
                  type="button"
                  className="ml-2 rounded-md bg-none p-2 text-gray-400"
                  onClick={() => setOpen(!open)}
                >
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <ReferenceLink target={logoLink} className="flex h-20 bg-white items-center px-6 md:pt-1">
                <span className="sr-only">Catwalk</span>
                <div className="relative h-full w-40">
                  <Image
                    media={logo.media ? logo.media : { media: {} }}
                    className="dark:invert"
                    layout="fill"
                    objectFit="cover"
                    alt="Logo"
                  />
                </div>
              </ReferenceLink>
              <MegaMenu MegaMenuData={megaMenuData} />
              <div className="flex flex-1 h-full items-center justify-end">
                <div className="flex w-fit items-center h-full justify-center items-center">
                  <div className="hidden flex-1 lg:block px-5 text-light-100" onClick={handleButtonClick}>
                    <SearchButton />
                   {!isButtonClicked && <p className="iconname">Algolia Search</p>}
                  </div>
                  {/* <DarkModeWidget className="mr-4 text-primary-400 hover:text-primary-500 dark:text-primary-100" /> */}
                  {/* <ReferenceLink target={logoLink} className="-m-2 p-2">
                    <button className="mr-5 hidden rounded-full bg-white py-2 px-5 text-base text-primary-100 duration-300 hover:underline decoration-2 lg:block">
                      Products
                    </button>
                  </ReferenceLink> */}

                  <div className="px-5 text-light-100">
                    <AccountButton account={account} accountLink={accountLink} />
                    <p className="iconname ">{account ? 'Profile' : 'Login'}</p>
                  </div>
                  <div className="px-5 text-light-100">
                    <WishListButton wishlistItemCount={wishlistItemCount} wishlistLink={wishlistLink} data={data} />
                    <p className="iconname">Wishlist</p>
                  </div>
                  <div className="px-5 text-light-100">
                    {/* <span className="mx-4 h-6 w-px bg-gray-200 lg:mx-4" aria-hidden="true" /> */}
                    <CartButton cartItemCount={cartItemCount} cartLink={cartLink} data={data} />
                    <p className="iconname">Cart</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;

