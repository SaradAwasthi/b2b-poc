import React, { useEffect, useState, useRef } from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import useHash from 'helpers/hooks/useHash';
import Redirect from 'helpers/redirect';
import { Reference } from 'helpers/reference';
import { useAccount } from 'frontastic';
import {
  AddressesSection,
  GeneralSection,
  SecuritySection,
  MyQuotesSection,
  OrdersHistorySection,
  QuotesApprove,
  associatess,
  AddAssociate
} from './sections/exporter';
import Company from './sections/View_Company/Company';
import AddCompany from './sections/AddCompany';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export interface AccountDetailsProps {
  loginLink?: Reference;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ loginLink }) => {
  //account data
  const { loggedIn, account } = useAccount();

  console.log('account', account);

  const [selectedTab, setSelectedTab] = useState<string>('');

  //i18n messages
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  //current window hash
  const hash = useHash();

  //user not logged in
  setTimeout(() => {
    if (!loggedIn) return <Redirect target={loginLink} />;
  }, 500);
  //tabs
  const tabs = [
    {
      name: formatAccountMessage({ id: 'general', defaultMessage: 'General' }),
      href: '#',
      showToUser: true,
    },
    {
      name: formatAccountMessage({ id: 'shipping', defaultMessage: 'Address' }),
      href: '#addresses',
      showToUser: true,
    },

    {
      name: formatAccountMessage({ id: 'quotes', defaultMessage: 'My Quotes' }),
      href: '#myQuotes',
      showToUser: true,
    },
    {
      name: formatAccountMessage({ id: 'quotesApprove', defaultMessage: 'Quotes Approval' }),
      href: '#quotesApproval',
      showToUser: true,
    },
    {
      name: formatAccountMessage({ id: 'addAssociate', defaultMessage: 'Add Associates' }),
      href: '#addAssociate',
      showToUser: true,
    },
    {
      name: formatAccountMessage({ id: 'associate', defaultMessage: 'Associates' }),
      href: '#Associates',
      showToUser: true,
    },

    {
      name: formatAccountMessage({ id: 'addCompany', defaultMessage: 'Register Company' }),
      href: '#addCompany',
      showToUser: true,
    },
    {
      name: formatAccountMessage({ id: 'companies', defaultMessage: 'Company' }),
      href: '#company',
      showToUser: true,
    },


    {
      name: formatAccountMessage({ id: 'orders', defaultMessage: 'Orders' }),
      href: '#orders',
      showToUser: true,
    },
    {
      name: formatAccountMessage({ id: 'security', defaultMessage: 'Security' }),
      href: '#security',
      showToUser: true,
    },
  ];
  const contentContainerRef = useRef(null);

  const handleTabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHash = e.target.value;
    window.location.hash = newHash;
    setSelectedTab(newHash);
  };

  const handleTabClick = (href) => {
    setSelectedTab(href);

    // Scroll the content container into view
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  //tabs-content mapping
  const mapping = {
    '#': GeneralSection,
    '#addresses': AddressesSection,
    '#security': SecuritySection,
    '#orders': OrdersHistorySection,
    '#myQuotes': MyQuotesSection,
    '#addCompany' : AddCompany,
    '#company': Company,
    '#quotesApproval': QuotesApprove,
    '#Associates': associatess,
    '#addAssociate': AddAssociate,
  };

  //current rendered content
  const Content = mapping[hash];

  return (
    <>
      <div>
        {/* Content area */}
        <div>
          {/* <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0"> */}
          <div className="">
            <main className="flex-1">
              {/* <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0"> */}
              <div className="">
                <div className="">
                  <div className="w-full ">
                    <div className="py-6">
                      <div className="w-full ">
                        {/* Selected Tab Name */}
                        {/* {selectedTab && (
                          <h2 className="mb-4 text-center text-xl font-semibold">
                            {tabs.find((tab) => tab.href === selectedTab)?.name}
                          </h2>
                        )} */}
                      </div>
                      <div className="flex flex-col lg:flex-row">
                        <div className=" pr-1 lg:block pt-11">
                          {/* Vertical Tabs */}
                          <nav className="space-y-4 pl-14 flex flex-col justify-evenly overflow-y-auto h-full max-h-[520px] bg-rc-brand-primary pr-14 ">
                            {tabs.map((tab) => {
                              if (
                                (!tab.showToUser || account?.email !== 'barathkumar.j@royalcyber.com' && account?.email !== 'mahaveer@royalcyber.com') &&
                                (tab.href === '#addAssociate' ||
                                  tab.href === '#addCompany' ||
                                  tab.href === '#company'||
                                  tab.href === '#quotesApproval')
                              ) {
                                return null;
                              }
                              return (
                                <a
                                  key={tab.name}
                                  href={tab.href}
                                  className={classNames(
                                    tab.href === hash
                                      ? 'border-gray-500 text-white hover:opacity-80 '
                                      : 'border-transparent text-white hover:border-gray-300 hover:opacity-80 dark:text-light-100',
                                    'block whitespace-nowrap border-b-2 py-4 px-2.5 text-sm font-medium',
                                  )}
                                  onClick={() => handleTabClick(tab.href)}
                                >
                                  {tab.name}
                                </a>
                              );
                            })}
                          </nav>
                        </div>
                        <div className="w-full" ref={contentContainerRef}>
                          {' '}
                          {Content && <Content />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
