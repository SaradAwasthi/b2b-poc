import React, { useEffect, useState } from 'react';
//import { useQuery, gql } from 'react-apollo';
import { setDefaultShippingAddress } from 'frontastic/actions/account';
// import { LOAD_BusinessUnits } from './GraphQL/company';
import { DELETE_COMPANY } from '../GraphQl/Comany_Queries';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { useAccount } from 'frontastic';
import { faEye, faArrowLeft, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormat } from 'helpers/hooks/useFormat';

function GetCompany() {
  const [users, setUsers] = useState([]);
  const [deleteItem] = useMutation(DELETE_COMPANY);
const {formatMessage: formatAccountMessage} = useFormat({ name: 'account' });
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('BearerToken');

        const response = await fetch(
          `${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/business-units`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data.results);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (id, version) => {
    try {
      await deleteItem({
        variables: {
          id,
          version,
        },
      });

      const updatedUsers = users.filter((associatessData) => associatessData?.customer?.id != actions);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  return (
    <>
    <div className="space-y-1 ml-1 pl-5 py-4 border-b-4">
          <h3 className="text-lg font-medium leading-6 text-black dark:text-light-100">
            {formatAccountMessage({ id: '', defaultMessage: "Company Details" })}
          </h3>
          <p className="max-w-2xl text-sm text-gray-600 pb-4">
            {formatAccountMessage({
              id: 'orders.desc',
              defaultMessage: 'Check the status of all companies.',
            })}
          </p>
        </div>
      <table className="min-w-full">
        <thead className="border-b-4">
          <tr className="text-sm">
            <th className="hidden px-2 py-4 text-left font-medium text-gray-900 lg:block lg:px-6">Company Name</th>
            <th className="px-6 py-4 text-left font-medium text-gray-900">Address</th>
            <th className="px-6 py-4 text-left font-medium text-gray-900">Created on</th>
            <th className="px-6 py-4 text-left font-medium text-gray-900">Modified on</th>
            <th className="px-6 py-4 text-left font-medium text-gray-900">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((val) => (
            <tr key={val.id} className="border-b text-sm">
              <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6">
                {val.name}
              </td>
              <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                {val.addresses[0]?.streetName}, {val.addresses[0]?.streetNumber}, {val.addresses[0]?.city},
                {val.addresses[0]?.postalCode}, {val.addresses[0]?.state}, {val.addresses[0]?.country}
              </td>
              <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                {val.createdAt.split('T')[0]}
              </td>
              <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6">
                {val.lastModifiedAt.split('T')[0]}
              </td>
              <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                <center>
                  <button type="button" onClick={() => handleDelete(val.id, val.version)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </center>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
export default GetCompany;
