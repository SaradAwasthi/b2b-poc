import React, { ChangeEvent, useState, useEffect } from 'react';
import { ShippingMethod } from '@Types/cart/ShippingMethod';
import { ProjectSettings } from '@Types/ProjectSettings';
import { countryOptions, CountryOption } from 'helpers/countryOptions';
import { useFormat } from 'helpers/hooks/useFormat';
import { getTaxedCountries } from 'helpers/utils/getTaxedCountries';
import { useCart } from 'frontastic/provider';
import { FormData } from '..';

type AddressProps = {
  data: FormData;
  updateData: (data: FormData) => void;
  billingIsSameAsShipping: boolean;
  toggleBillingAddressOption: () => void;
};

const Address: React.FC<AddressProps> = ({ data, updateData, billingIsSameAsShipping, toggleBillingAddressOption }) => {
  const [projectSettingsCountries, setProjectSettingsCountries] = useState<ProjectSettings>(null);
  const [shippingMethodsData, setShippingMethodsData] = useState<ShippingMethod[]>(null);
  const [availableCountryOptions, setAvailableCountryOptions] = useState<CountryOption[]>(null);
  const { getProjectSettings, shippingMethods } = useCart();
  const { formatMessage } = useFormat({ name: 'checkout' });
  const { formatMessage: formatCommonMessage } = useFormat({ name: 'common' });

  useEffect(() => {
    getProjectSettings().then((data) => {
      setProjectSettingsCountries(data);
      setShippingMethodsData(shippingMethods.data);
    });
  }, []);

  useEffect(() => {
    if (!shippingMethods.data || !projectSettingsCountries) {
      const showMessageInDropdown = {
        data: '',
        display: `${formatMessage({
          id: 'no.countries.available.for.shipping',
          defaultMessage: 'Currently there are no countries available for shipping',
        })}`,
      };
      setAvailableCountryOptions([showMessageInDropdown]);
    } else {
      const totalCountries = getTaxedCountries(shippingMethods?.data, projectSettingsCountries?.countries);

      setAvailableCountryOptions(totalCountries);
    }
  }, [shippingMethods, projectSettingsCountries, shippingMethodsData]);

  const handleChange = (e: ChangeEvent) => {
    const updatedData = {
      ...data,
      [(e.target as HTMLInputElement)?.name]: (e.target as HTMLInputElement)?.value,
    };
    updateData(updatedData);
  };

  return (
<section aria-labelledby="cart-heading" className="bg-white rounded-md shadow-md lg:col-span-7 p-6">
  <form className="space-y-4">

    {/* Shipping Information */}
    <div className="text-sm font-bold uppercase text-neutral-600">{formatMessage({ id: 'shippingTo', defaultMessage: 'Shipping to' })}</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="firstName" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'firstName', defaultMessage: 'First name' })} *</label>
        <input type="text" id="firstName" name="firstName" value={data.firstName} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'lastName', defaultMessage: 'Last name' })} *</label>
        <input type="text" id="lastName" name="lastName" value={data.lastName} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'phone', defaultMessage: 'Phone number' })}</label>
        <input type="text" id="phone" name="phone" value={data.phone} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'email', defaultMessage: 'Email' })} *</label>
        <input type="email" id="email" name="email" value={data.email} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
      </div>
    </div>

    {/* Shipping Address */}
    <div className="text-sm font-bold uppercase text-neutral-600">{formatMessage({ id: 'shippingAddress', defaultMessage: 'Shipping address' })}</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Shipping Street Name */}
      <div>
        <label htmlFor="shipping-street-name" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'street.name', defaultMessage: 'Street name' })} *</label>
        <input type="text" id="shipping-street-name" name="shippingStreetName" value={data.shippingStreetName} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
      </div>
      {/* Shipping City */}
      <div>
        <label htmlFor="shipping-city" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'city', defaultMessage: 'City' })} *</label>
        <input type="text" id="shipping-city" name="shippingCity" value={data.shippingCity} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
      </div>
      {/* Shipping Postal Code */}
      <div>
        <label htmlFor="shipping-postalCode" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'zipCode', defaultMessage: 'Postal code' })} *</label>
        <input type="text" id="shipping-postalCode" name="shippingPostalCode" value={data.shippingPostalCode} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
      </div>
      {/* Shipping Country */}
      <div>
        <label htmlFor="shipping-country" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'country', defaultMessage: 'Country' })} *</label>
        <select id="shipping-country" name="shippingCountry" value={data.shippingCountry} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required>
          <option value=""></option>
          {availableCountryOptions?.map(({ display, data }, index) => (
            <option key={index} value={data}>{formatCommonMessage({ id: `country.${data}`, defaultMessage: display })}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Billing Address Checkbox */}
    <label className="flex items-center bg-neutral-200 rounded p-4 text-sm">
      <input type="checkbox" id="billing-same-as-shipping" checked={billingIsSameAsShipping} onChange={toggleBillingAddressOption} className="mr-2 text-xl" />
      {formatMessage({ id: 'billingDetailsLabel', defaultMessage: 'Billing address is the same as shipping address' })}
    </label>

    {/* Billing Address Fields */}
    {!billingIsSameAsShipping && (
      <div>
        <div className="text-sm font-bold uppercase text-neutral-600">{formatMessage({ id: 'billingInformation', defaultMessage: 'Billing information' })}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Billing Street Name */}
          <div>
            <label htmlFor="billing-street-name" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'street.name', defaultMessage: 'Street name' })} *</label>
            <input type="text" id="billing-street-name" name="billingStreetName" value={data.billingStreetName} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
          </div>
          {/* Billing City */}
          <div>
            <label htmlFor="billing-city" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'city', defaultMessage: 'City' })} *</label>
            <input type="text" id="billing-city" name="billingCity" value={data.billingCity} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
          </div>
          {/* Billing Postal Code */}
          <div>
            <label htmlFor="billing-postalCode" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'zipCode', defaultMessage: 'Postal code' })} *</label>
            <input type="text" id="billing-postalCode" name="billingPostalCode" value={data.billingPostalCode} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required />
          </div>
          {/* Billing Country */}
          <div>
            <label htmlFor="billing-country" className="block text-sm text-neutral-700 mb-1">{formatCommonMessage({ id: 'country', defaultMessage: 'Country' })} *</label>
            <select id="billing-country" name="billingCountry" value={data.billingCountry} onChange={handleChange} className="input-field rounded" style={{ width: '-webkit-fill-available' }} required>
              <option value=""></option>
              {countryOptions.map(({ display, data }, index) => (
                <option key={index} value={data}>{formatCommonMessage({ id: `country.${data}`, defaultMessage: display })}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )}
  </form>
</section>

  );
};

export default Address;
