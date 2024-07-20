import React, { ChangeEvent, useEffect, useState } from 'react';

import { Reference, ReferenceLink } from 'helpers/reference';
import { useRouter } from 'next/router';
import { AddAssociate } from '../exporter';

interface Props {
  readonly onSubmit?: (e: MouseEvent) => void;
  readonly submitButtonLabel?: string;
  readonly disableSubmitButton?: boolean;
  readonly showSubmitButton?: boolean;
  readonly showDiscountsForm?: boolean;

  termsLink?: Reference;
  cancellationLink?: Reference;
  privacyLink?: Reference;
}

const addAssociate = ({
  onSubmit,
  showSubmitButton = true,
  showDiscountsForm = true,

  disableSubmitButton,
}: Props) => {
  const router = useRouter();
  const submitButtonClassName = `${disableSubmitButton ? 'opacity-75 pointer-events-none my-2' : ''} ${
    !showDiscountsForm ? 'mt-7' : ''
  } rounded-lg bg-primary-100 py-3 px-5 text-white duration-300 hover:opacity-80 hover:drop-shadow-md`;

  const [email, setemail] = useState('');

  const [customerId, setCustomerId] = useState('');

  const [firstName, setfirstName] = useState('');
  const [role, setRole] = useState('');
  const [lastName, setlastName] = useState('');
  const [password, setpassword] = useState('');
  const [isEmailVerified, setisEmailVerified] = useState('');

  const [dataa, setDataa] = useState([]); // Store API data
  const [selectedId, setSelectedId] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');

  const [keyValue, setKeyValue] = useState('');
  const [keyValuee, setKeyValuee] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Buyer');

  // getting business units details
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
          const responseData = await response.json();
          setDataa(responseData.results);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedResult = dataa.find((result) => result.name === selectedValue);

    if (selectedResult) {
      setSelectedId(selectedResult.id);
      setSelectedName(selectedValue);
      setSelectedVersion(selectedResult.version);
    }
  };

  // Adding the role along with creating customer
  async function addRoleAndCustomer() {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('BearerToken');

      const payloadCustomer = {
        firstName: firstName,
        email: email,
        lastName: lastName,
        password: password,
        isEmailVerified: true,
      };

      // Create the customer
      const responseCustomer = await fetch(
        `${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/customers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payloadCustomer),
        },
      );

      let customerId = null;
      if (responseCustomer.ok) {
        const customerData = await responseCustomer.json();
        customerId = customerData?.customer?.id;
      } else {
        console.error('Error creating customer:', responseCustomer.statusText);
        setIsLoading(false);
        return;
      }

      // Now, add the role
      const payloadRole = {
        version: selectedVersion,
        actions: [
          {
            action: 'addAssociate',
            associate: {
              customer: {
                typeId: 'customer',
                id: customerId,
              },
              associateRoleAssignments: [
                {
                  associateRole: {
                    typeId: 'associate-role',
                    key: role,
                  },
                  inheritance: 'Enabled',
                },
              ],
            },
          },
        ],
      };

      const responseRole = await fetch(
        `${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/business-units/${selectedId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payloadRole),
        },
      );

      if (responseRole.ok) {
        const result = await responseRole.text();
        console.log(result);
        setemail('');
        setfirstName('');
        setlastName('');
        setpassword('');
        setRole('');
      } else {
        console.error('Error adding role:', responseRole.statusText);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error adding role and customer:', error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <section
        aria-labelledby="summary-heading"
        className="comment-section bg-[#FFFFF] mt-4 rounded-lg py-10 px-4 lg:ml-5"
      >
        <div className="space-y-1">
          <h3 className="flex justify-start text-2xl text-center font-semibold leading-6 text-gray-900 dark:text-white">
            Associate Details
          </h3>
        </div>
        <br />
        <div className="grid justify-center">
        <div className="mb-2 mr-10">
          <div className="mb-2 flex justify-center">
            
              <label className="text-base mr-2 mt-2 font-semibold">Company Name : </label>
            
            <select value={selectedName} className="rounded-lg selectwidth" onChange={handleSelectChange}>
              <option value="" className="text-sm">Select Any One Company Name...</option>
              {dataa.map((result) => (
                <option key={result.id} value={result.name}>
                  {result.name}
                </option>
              ))}
            </select>
            {/* {selectedName && (
              <div>
                <p>Selected Name: {selectedName}</p>
                <p>Selected ID: {selectedId}</p>
                <p>Selected Version: {selectedVersion}</p>
              </div>
            )} */}
          </div>
        </div>

        <div className="flex space-x-10">
          <div className="mb-2 ">
            <div className="mb-2 font-semibold">
              <label className="text-base">Email</label>
            </div>
            <input type="text"className="rounded-lg" value={email} onChange={(e) => setemail(e.target.value)} />
          </div>
          <div className="mb-2">
            <div className="mb-2">
              <label className="text-base font-semibold">First Name</label>
            </div>

            <input type="text" className="rounded-lg" value={firstName} onChange={(e) => setfirstName(e.target.value)} />
          </div>
        </div>  
        <div className="flex space-x-10">
          <div className="mb-2">
            <div className="mb-2 font-semibold">
              <label className="text-base">Last Name</label>
            </div>
            <input type="text" className="rounded-lg" value={lastName} onChange={(e) => setlastName(e.target.value)} />
          </div>

          <div className="mb-2">
            <div className="mb-2">
              <label className="text-base font-semibold">Password</label>
            </div>
            <input type="text" className="rounded-lg" value={password} onChange={(e) => setpassword(e.target.value)} />
          </div>
        </div>
        
          <h2 className="text-center text-base p-5 font-semibold" >Enter Role</h2>
          <div className="flex justify-center">
          <select value={role} className="rounded-lg selectwidth" onChange={(e) => setRole(e.target.value)}>
            <option value="" className="text-base">Select role</option>
            <option value="Admin" className="text-base">Admin</option>
            <option value="Buyer"className="text-base" >Buyer</option>
          </select>
        </div>
        </div>
        {/* <div>
          <button onClick={createCustomer} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Customer'}
          </button>
        </div> */}
        <div>
          {/* <input
            type="text"
            value={keyValuee}
            onChange={(event) => setKeyValuee(event.target.value)}
            placeholder="Enter key value"
          /> */}
          {/* <section className="mt-5">
            <button onClick={addRole} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add ARole'}
            </button>
          </section> */}

          <div>
            <section className="mt-5 flex">
              <button
                onClick={() => {
                  addRoleAndCustomer();
                  window.alert('Associate has been added Successfully...');
                }}
                disabled={isLoading || !role || !email || !firstName || !lastName || !password}
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '5px',
                  width: '200px',
                  height: '50px',
                  margin: '0 auto',
                }}
              >
                {isLoading ? 'Adding...' : 'Add Associate'}
              </button>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};
export default addAssociate;
