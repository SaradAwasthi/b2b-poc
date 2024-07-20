import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { useCart } from 'frontastic/provider';
import { UPDATE_QUOTE } from '../account/details/sections/GraphQl/Quote_Queries';
import { useAccount } from 'frontastic';

function CreateQuote() {
  const { data: cartList } = useCart();

  const { loggedIn, account } = useAccount();

  console.log('cartList', cartList);
  console.log('cartid', cartList?.cartId);
  console.log('cartaVersion', cartList?.cartVersion);

  const [responseMessage, setResponseMessage] = useState('');

  cartList?.lineItems?.forEach((item) => {
    console.log('lineItId', item.lineItemId);
  });

  const router = useRouter();
  const [ADQuote, setADQuote] = useState({
    id: '',
    version: 0,
    state: '',
    update: false,
  });

  const [updateQuote] = useMutation(UPDATE_QUOTE, {
    variables: {
      id: ADQuote?.id,
      version: ADQuote?.version,
      actions: [
        {
          changeQuoteRequestState: {
            quoteRequestState: ADQuote?.state,
          },
        },
      ],
    },
  });

  useEffect(() => {
    !!ADQuote?.update &&
      updateQuote().then((response) => {
        if (!!response.data) {
          window.location.href = window.location.href.split('/home')[0] + '/account';
        }
      });
  }, [ADQuote]);

  const removeLineItemAndSubmit = () => {
    const token = localStorage.getItem('BearerToken');
    // console.log('token', token);

    const cartId = cartList?.cartId;
    // console.log('cartid', cartId);

    const orderVersion = cartList?.cartVersion;
    // console.log('cartaVersion', orderVersion);
    const lineItemId = cartList?.lineItems?.map((item) => item.lineItemId) || [];
    // console.log('lineItemId', lineItemId);

    const removeLineItemAction = {
      version: parseInt(orderVersion),
      actions: lineItemId.map((id) => ({
        action: 'removeLineItem',
        lineItemId: id,
      })),
    };

    fetch(`${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/carts/${cartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(removeLineItemAction),
    })
      .then((cartRes) => cartRes.json())
      .then((cartData) => {
        console.log(cartData);
        setADQuote({
          id: router?.query?.quoteId,
          version: parseInt(router?.query?.quoteVersion),
          state: 'Submitted',
          update: true,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const sendEmail = async () => {
    try {
      const apiUrl = 'https://sendgrid-notification-app-f4b4o225iq-uc.a.run.app/email/notifications';
      const requestBody = {
        toEmail: account?.email,
        subject: 'Quote Confirmation',
        body: 'Your Quote has been Submitted.',
        toName: account?.firstName,
        fromName: 'Royal Cyber',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponseMessage(data.message);

      console.log(data, 'data');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-15 mt-20 mb-20 ml-14 mr-14 ">
      <div className="head-div font-extrabold">
        <p>Product</p>
      </div>
      <table className="min-w-full">
        <thead className="border-b-4">
          <tr>
            <th className="px-2 py-4 text-left text-base font-medium text-gray-900 lg:px-6">Product</th>
            <th className="hidden px-2 py-4 text-left text-base font-medium text-gray-900 lg:block lg:px-6">Price</th>
            <th className="px-2 py-4 text-left text-base font-medium text-gray-900 lg:px-6">Quantity</th>
            <th className="hidden px-2 py-4 text-left text-base font-medium text-gray-900 lg:block lg:px-6">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {router?.query?.singlePage !== 'true' &&
            cartList?.lineItems?.length > 0 &&
            cartList.lineItems.map((data) => (
              <>
                <tr className="border-b">
                  <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">{data.name}</td>
                  <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6 lg:text-base">
                    {data.price.centAmount / 100} {data.price.currencyCode}
                  </td>
                  <td className="padding-bottom px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                    {data.count}
                  </td>
                  <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6 lg:text-base">
                    {data.totalPrice.centAmount / 100} {data.totalPrice.currencyCode}
                  </td>
                </tr>
              </>
            ))}
          {router?.query?.singlePage === 'true' && (
            <tr className="border-b">
              <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                {router?.query?.productName}
              </td>
              <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6 lg:text-base">
                {router?.query?.productPrice / 100} {router?.query?.productCurrency}
              </td>
              <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                {router?.query?.quantity}
              </td>
              <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6 lg:text-base">
                {router?.query?.productPrice / 100} {router?.query?.(productCurrency)}
              </td>
            </tr>
          )}
          {router?.query?.singlePage !== 'true' ? (
            <tr className="border-b">
              <td className="whitespace-nowrap px-2 py-4 text-sm font-bold text-gray-900 lg:px-6 lg:text-base">
                Total
              </td>
              <td />
              <td />
              <td className="whitespace-nowrap px-2 py-4 text-sm font-bold text-gray-900 lg:px-6 lg:text-base">
                {cartList?.sum?.centAmount / 100} {cartList?.sum?.currencyCode}
              </td>
            </tr>
          ) : (
            <tr className="border-b">
              <td className="whitespace-nowrap px-2 py-4 text-sm font-bold text-gray-900 lg:px-6 lg:text-base">
                Total
              </td>
              <td />
              <td />
              <td className="whitespace-nowrap px-2 py-4 text-sm font-bold text-gray-900 lg:px-6 lg:text-base">
                {router?.query?.productPrice / 100} {router?.query?.productCurrency}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="submit-cancel-container ">
        <button
        className=' rounded-full mt-3 mr-1 w-1/6 bg-rc-brand-primary py-2 px-5 text-sm text-white duration-300 hover:bg-gray-100 hover:text-black hover:drop-shadow-md'
          onClick={() => {
            removeLineItemAndSubmit();
            sendEmail();
          }}
        >
          Submit Quote
        </button>
        <button
        className=' rounded-full mt-3 w-1/6 bg-rc-brand-primary py-2 px-5 text-sm text-white duration-300 hover:bg-gray-100 hover:text-black hover:drop-shadow-md'
          
          onClick={() =>
            setADQuote({
              id: router?.query?.quoteId,
              version: parseInt(router?.query?.quoteVersion),
              state: 'Cancelled',
              update: true,
            })
          }
        >
          Cancel Quote
        </button>
      </div>
    </div>
  );
}
export default CreateQuote;
