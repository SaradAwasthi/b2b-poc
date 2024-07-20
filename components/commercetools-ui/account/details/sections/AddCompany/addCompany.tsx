import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
//import { useQuery, gql } from 'react-apollo';
import { setDefaultShippingAddress } from 'frontastic/actions/account';
import { CREATE_COMPANY } from '../GraphQl/Create_Company_Queries';
import { useQuery } from '@apollo/client';
import { Reference, ReferenceLink } from 'helpers/reference';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { useFormat } from 'helpers/hooks/useFormat';

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

const AddCompany = ({
  onSubmit,
  showSubmitButton = true,
  showDiscountsForm = true,
  submitButtonLabel,
  disableSubmitButton,
  termsLink,
  cancellationLink,
  privacyLink,
}: Props) => {
  const router = useRouter();
  const submitButtonClassName = `${disableSubmitButton ? 'opacity-75 pointer-events-none my-2' : ''} ${
    !showDiscountsForm ? 'mt-7 ' : ''
  }  m-auto bg-rc-brand-primary rounded bg-primary-100 py-3 px-5 text-white duration-300 hover:opacity-80  hover:drop-shadow-md`;
  const [selectedOption, setSelectedOption] = useState('');
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const [createCompany, setCreateCompany] = useState({
    type: '',
    name: '',
    key: '',
    addresses: {
      streetName: '',
      streetNumber: '',
      city: '',
      postalCode: '',
      state: '',
      country: '',
    },
  });

  const [createCompanyCheck, setCreateCompanyCheck] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [streetName, setStreetName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [CreateCompanyDraft] = useMutation(CREATE_COMPANY, {
    variables: {
      draft: {
        unitType: createCompany.type,
        name: createCompany.name,
        key: createCompany.key,
        addresses: {
          ...createCompany.addresses,
          // streetName: createCompany.addresses.streetName,
          // streetNumber: createCompany.streetNumber,
          // city: createCompany.city,
          // postalCode: createCompany.postalCode,
          // state: createCompany.state,
          // country: createCompany.country,
        },
      },
    },
  });

  useEffect(() => {
    if (!!createCompanyCheck) {
      CreateCompanyDraft().then((res) => {
        router.push({
          pathname: 'account#company',
          query: { companyId: res.data.createBusinessUnit.id, companyVersion: res.data.createBusinessUnit.version },
        });
      });
      setCreateCompanyCheck(false);
    }
  }, [createCompany, CreateCompanyDraft]);

  const handleCompany = () => {
    const companyData = {
      type: type,
      key: name.replace(/\s+/g, ''),
      name: name,
      addresses: {
        streetName: streetName,
        streetNumber: streetNumber,
        city: city,
        postalCode: postalCode,
        state: state,
        country: country,
      },
    };
    setCreateCompany(companyData);
    setCreateCompanyCheck(true);

    setName('');
    setType('');
    setStreetName('');
    setStreetNumber('');
    setCity('');
    setPostalCode('');
    setState('');
    setCountry('');
  };

  return (
    <>
      <section
        aria-labelledby="summary-heading"
        className="comment-section mt-4 rounded-lg bg-[#FFFFFF] lg:ml-5"
      >
        <div className="space-y-1">
          <h3 className="flex justify-center text-2xl font-semibold leading-10 bg-rc-brand-primary text-gray-900 text-white">
            Company Details
          </h3>
        </div>
        <br />
        
        <div className='flex '>

        <div className="mb-2 w-1/2">
          <div className="mb-2">
            <label className="text-sm">Company Name</label>
          </div>
          <input type="text" className="rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
          {/* <textarea onChange={(e) => setName(e.target.value)} value={name} /> */}
        </div>

        <div className="mb-2 w-1/2">
          <div className="mb-2">
            <label className="text-sm">Unit Type</label>
          </div>
          <select id="options" className="rounded-lg selectwidth" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="" className="text-sm">-- Select Type --</option>
            <option value="Company" className="text-sm">Company</option>
            <option value="Division" className="text-sm">Division</option>
          </select>
          {/* <p>Selected Type: {type}</p> */}
        </div>
        </div>
        <div className="space-y-1 mt-4">
          <h3 className="flex justify-center text-2xl font-semibold leading-10 bg-rc-brand-primary text-gray-900 text-white">
            Company Address Details
          </h3>
        </div>
        <br />
        <div className="flex justify-between">
        <div className=''>
        <div className="mb-2">
          <div className="mb-2">
            <label className="text-sm">Street Name</label>
          </div>
          <input type="text" className="rounded-lg" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
        </div>

        <div className="mb-2">
          <div className="mb-2">
            <label className="text-sm">Street Number</label>
          </div>
          <input type="text" className="rounded-lg" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} />
        </div>
        </div>
        <div className=''>
        <div className="mb-2">
          <div className="mb-2">
            <label className="text-sm">City</label>
          </div>
          <input type="text" className="rounded-lg" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <div className="mb-2">
          <div className="mb-2">
            <label className="text-sm">Postal Code</label>
          </div>
          <input type="text" className="rounded-lg" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>
        </div>

        <div className=''>
        <div className="mb-2">
          <div className="mb-2">
            <label className="text-sm">State</label>
          </div>
          <input type="text" className="rounded-lg" value={state} onChange={(e) => setState(e.target.value)} />
        </div>

        <div className="mb-2">
          <div className="mb-2">
            <label className="text-sm">Country</label>
          </div>
          <input type="text" className="rounded-lg" value={country} onChange={(e) => setCountry(e.target.value)} />
        </div>
        </div>
        </div>   
        <section className="mt-5">
          {showSubmitButton && (
            <div className="flex">
              {window.location.pathname !== '/account#company' && (
                <button
                  type="button"
                  onClick={() => {
                    handleCompany();
                    window.alert('Company has been added Successfully...');
                  }}
                  className={submitButtonClassName}
                  style={{
                    // backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '5px',
                    width: '200px',
                    height: '50px',
                  }}
                >
                  Create Company
                </button>
              )}
            </div>
          )}
        </section>
      </section>
    </>
  );
};
export default AddCompany;
