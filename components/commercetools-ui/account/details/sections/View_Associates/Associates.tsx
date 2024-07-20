import React, { useEffect, useState } from 'react';
import { useAccount } from 'frontastic'; // Assuming useAccount is the hook for getting account information
import { useFormat } from 'helpers/hooks/useFormat';

function GetAssociates() {
  const { account } = useAccount(); // Get the logged-in account information
  const [businessUnits, setBusinessUnits] = useState([]); // State to store business units data
  const loggedInEmail = account?.email; // Get the logged-in user's email
  
const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  async function fetchData() {
    try {
      const token = localStorage.getItem('BearerToken');
      const response = await fetch(`${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/business-units?expand=associates[*].customer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setBusinessUnits(responseData.results); // Set the fetched business units data
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Render function to display associates based on user role
  function renderAssociates() {
    // Find the business unit where the logged-in user belongs
    const loggedInUserUnit = businessUnits.find(unit => unit.associates.some(associate => associate.customer.obj.email === loggedInEmail));

    if (!loggedInUserUnit) {
      return <div>No associated business unit found for the logged-in user.</div>;
    }

    // Find the role of the logged-in user
    const loggedInUserRole = loggedInUserUnit.associates.find(associate => associate.customer.obj.email === loggedInEmail)?.associateRoleAssignments[0].associateRole.key;

    if (loggedInUserRole === 'Admin') {
      // If user is admin, display all associates in the same business unit
      return (
        <><div className="space-y-1 ml-1 pl-5 py-4 border-b-4">
          <h3 className="text-lg font-medium leading-6 text-black dark:text-light-100">
            {formatAccountMessage({ id: 'quote.history', defaultMessage: "Associates History.." })}
          </h3>
          <p className="max-w-2xl text-sm text-gray-600 pb-4">
            {formatAccountMessage({
              id: 'orders.desc',
              defaultMessage: `Check the status of all buyers from ${account?.firstName} ${account?.lastName}`,
            })}
          </p>
        </div>
        <div>
          <table className="min-w-full">
            <thead className="border-b-4">
            <tr className="text-sm">
              <th className="hidden px-2 py-4 text-left font-medium text-gray-900 lg:block lg:px-6">
                BusinessUnit Name
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">Email</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">FirstName</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">LastName</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">Roles</th>
            </tr>
          </thead>
          <tbody>
            {loggedInUserUnit.associates.map((associate, index) => (
              <tr key={index} className="border-b text-sm">
                <td className="hidden whitespace-nowrap px-2 py-4 font-light text-gray-900 lg:block lg:px-6">
                  {loggedInUserUnit.name}
                </td>
                <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {associate.customer && associate.customer.obj && associate.customer.obj.email}
                </td>
                <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {associate.customer && associate.customer.obj && associate.customer.obj.firstName}
                </td>
                <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {associate.customer && associate.customer.obj && associate.customer.obj.lastName}
                </td>

                <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6">
                  {associate.associateRoleAssignments[0].associateRole.key}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          
        </div>
        </>
      );
    } else if (loggedInUserRole === 'Buyer') {
      // If user is buyer, display the user's information
      const loggedInAssociate = loggedInUserUnit.associates.find(associate => associate.customer.obj.email === loggedInEmail && associate.associateRoleAssignments.some(role => role.associateRole.key === 'Buyer'));

      return (
        <>
        <div className="space-y-1 ml-1 pl-5 py-4 border-b-4">
          <h3 className="text-lg font-medium leading-6 text-black dark:text-light-100">
            {formatAccountMessage({ id: 'quote.history', defaultMessage: `Associate History of ${loggedInAssociate.customer.obj.firstName} ${loggedInAssociate.customer.obj.lastName} ` })}
          </h3>
          <p className="max-w-2xl text-sm text-gray-600 pb-4">
            {formatAccountMessage({
              id: 'orders.desc',
              defaultMessage: `Check the associate status of ${account?.email}`,
            })}
          </p>
        </div>
        <div>
          <table className="min-w-full">
            <thead className="border-b-4">
            <tr className="text-sm">
              <th className="hidden px-2 py-4 text-left font-medium text-gray-900 lg:block lg:px-6">
                BusinessUnit Name
              </th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">Email</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">FirstName</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">LastName</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">Roles</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b text-sm">
                <td className="hidden whitespace-nowrap px-2 py-4 font-light text-gray-900 lg:block lg:px-6">
                  {loggedInUserUnit.name}
                </td>
                <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {loggedInAssociate?.customer && loggedInAssociate?.customer?.obj && loggedInAssociate.customer.obj.email}
                </td>
                <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {loggedInAssociate.customer && loggedInAssociate.customer.obj && loggedInAssociate.customer.obj.firstName}
                </td>
                <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                  {loggedInAssociate.customer && loggedInAssociate.customer.obj && loggedInAssociate.customer.obj.lastName}
                </td>

                <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6">
                  {loggedInAssociate.associateRoleAssignments[0].associateRole.key}
                </td>
              </tr>
          </tbody>
          </table>
        </div>
        </>
      );
    } else {
      return <div>User role not recognized.</div>;
    }
  }

  return (
    <div>
      {renderAssociates()}
    </div>
  );
}

export default GetAssociates;
