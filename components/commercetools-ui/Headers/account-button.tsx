
import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/outline';
import { Account } from '@Types/account/Account';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference, ReferenceLink } from 'helpers/reference';
import { logout } from 'frontastic/actions/account';
import LoginDrawerComponent from 'frontastic/tastics/example/login-drawer';
import AccountLoginTastic from 'frontastic/tastics/account/login';
import AccountRegisterTastic from 'frontastic/tastics/account/register';
import { useRouter } from 'next/router';

interface AccountButtonProps {
  accountLink: Reference;
  account: Account;
}

const AccountButton: React.FC<AccountButtonProps> = ({ accountLink, account }) => {
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const [showLogin, setShowLogin] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
const router = useRouter();
  const handleLogout = () => {
    
    logout();
    
  router.push('/home');
    
  };

  const data = {
    desktop: true,
    logo: {
      media: {
        created: '2022-08-16T10:51:41+00:00',
        file: 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1660647101/g4nbrjdzce6qdb4x2lpz.png',
        format: 'png',
        height: 66,
        mediaId: 'g4nbrjdzce6qdb4x2lpz',
        metaData: '_FILTERED_',
        name: 'Logo',
        resourceType: 'image',
        size: 5012,
        tags: ['__none'],
        width: 142,
        _type: 'Frontastic\\Backstage\\MediaApiBundle\\Domain\\MediaApi\\Media',
      },
    },
    accountLink: {
      link: '/account',
      openInNewWindow: false,
      type: 'link',
      _type: 'Frontastic\\Catwalk\\NextJsBundle\\Domain\\Api\\TasticFieldValue\\LinkReferenceValue',
    },
    title: { en_GB: '' },

    mobile: true,
    registerLink: {
      link: '/register',
      openInNewWindow: false,
      type: 'link',
      _type: 'Frontastic\\Catwalk\\NextJsBundle\\Domain\\Api\\TasticFieldValue\\LinkReferenceValue',
    },
  };

  const renderLoginButton = () => (
    <div className="flex space-x-8">
      <div className="flex">
        <button
          className="accountbutton rounded-full text-base text-primary-100 decoration-2 duration-300 hover:underline"
          onClick={() => setShowPopup(true)}
        >
          <UserIcon className="h-6 w-6 stroke-2 text-white dark:text-light-100" aria-hidden="true" />
        </button>
      </div>
      <LoginDrawerComponent
        isOpen={showPopup}
        setIsOpen={setShowPopup}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
      >
        {showLogin ? <AccountLoginTastic data={data} /> : <AccountRegisterTastic data={data} />}
      </LoginDrawerComponent>
    </div>
  );

  const renderProfileButton = () => (
    <Menu>
      <div className="relative flex space-x-8">
        <Menu.Button className="flex">
          <span className="sr-only">Account</span>
          <UserIcon className="h-6 w-6 ml-2 text-primary-100 dark:text-light-100" aria-hidden="true" />
        </Menu.Button>
        <div className="absolute -right-[1px] -bottom-[2px] h-[9px] w-[9px] rounded-md bg-green-700"></div>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-6 z-50 mt-2 w-fit origin-top-right rounded-md bg-white shadow-sm ring-1 ring-black/5 focus:outline-none dark:bg-primary-400 dark:shadow-3xl">
          <div className="py-1 ">
            <Menu.Item>
              <ReferenceLink
                target={accountLink}
                className={`block w-36 cursor-pointer py-2 px-4 ${
                  account ? 'text-left' : 'text-center'
                }  text-sm  text-black hover:bg-gray-100 dark:bg-primary-400  dark:text-light-100`}
              >
                {account.firstName
                  ? formatAccountMessage({ id: 'hello', defaultMessage: 'Hi ' }) + account.firstName
                  : account.lastName
                  ? formatAccountMessage({ id: 'hello', defaultMessage: 'Hi ' }) + account.lastName
                  : formatAccountMessage({ id: 'hello', defaultMessage: 'Hi ' }) +
                    formatAccountMessage({ id: 'user', defaultMessage: 'User ' })}
              </ReferenceLink>
            </Menu.Item>
            {account && (
              <>
                <Menu.Item>
                  <button
                    onClick={handleLogout}
                    className="block w-36 cursor-pointer py-2 px-4 text-left text-sm text-black hover:bg-gray-100 dark:bg-primary-400 dark:text-black"
                  >
                    {formatAccountMessage({ id: 'signout', defaultMessage: 'Logout' })}
                  </button>
                </Menu.Item>
              </>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  return (
    <div className="relative m-0 flex justify-center items-center">
      {account ? renderProfileButton() : renderLoginButton()}
    </div>
  );
};

export default AccountButton;
