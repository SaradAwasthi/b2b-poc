import React, { useState } from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAccount } from 'frontastic';
import Address from '../../address';
import CreateAddressModal from '../../modals/createAddress';

const Addresses = () => {
  //18in messages
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  //account data
  const { account } = useAccount();

  //user addresses
  const addresses = account?.addresses.slice(0, 1);

  //create address modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  return (
    <>
      <style>
        {`
        form input[type='checkbox']:checked {
          background-image: url("data:image/svg+xml,<svg viewBox='0 0 16 16' fill='%23CE3E72' xmlns='http://www.w3.org/2000/svg'><path d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/></svg>");
          border-color: rgb(209 213 219 / var(--tw-border-opacity));
        }
        form input[type='checkbox']:checked:hover {
          border-color: rgb(209 213 219 / var(--tw-border-opacity));
        }
        `}
      </style>
      <div className="rounded-lg bg-gray-100 py-6 px-4 sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
  <div className="divide-y divide-gray-200 ml-12">
    <div className="space-y-1">
      {/* <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
        {formatAccountMessage({ id: 'address.myAddresses', defaultMessage: 'Shipping Address' })}
      </h3> */}
      <h3 className="mt-2 text-lg font-medium leading-6 text-gray-900 dark:text-white">Shipping Addresses</h3>
      <p className="max-w-2xl text-sm text-gray-500">
        {formatAccountMessage({
          id: 'shippingAddress.desc',
          defaultMessage: 'Here you can add different shipping addresses for your account',
        })}
      </p>
    </div>
    <div className="mt-6">
      <dl className="divide-y divide-gray-200">
        {addresses?.map((address) => (
          <Address key={address.addressId} address={address} />
        ))}
      </dl>
    </div>
    <div className="py-4 sm:py-8">
      <button
        type="button"
        className="mt-4 w-full items-center bg-rc-brand-primary rounded-md border border-transparent px-0 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:bg-gray-300 sm:w-fit sm:px-24"
        onClick={openCreateModal}
      >
        {formatAccountMessage({ id: 'shippingAddress.add', defaultMessage: 'Add an address' })}
      </button>
    </div>
  </div>
</div>

      <CreateAddressModal open={createModalOpen} onClose={closeCreateModal} />
    </>
  );
};

export default Addresses;
