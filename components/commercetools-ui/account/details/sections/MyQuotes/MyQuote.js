import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useAccount, useCart } from 'frontastic';
import { LOAD_USERS } from '../GraphQl/Quote_Queries';
import { faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useFormat } from 'helpers/hooks/useFormat';

function MyQuote() {
  const account = useAccount();
  const { error, loading, data } = useQuery(LOAD_USERS, { variables: { limit: 500, sort: 'lastModifiedAt desc' } });
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState(false);
  const [quoteData, setQuoteData] = useState([]);
  const router = useRouter();

  const [totalPrices, setTotalPrices] = useState([]);
  const [selectedTotalPriceIndex, setSelectedTotalPriceIndex] = useState(null);

  const [quoteInfo, setQuoteInfo] = useState({}); // Changed the state variable name
  const [showQuotes, setShowQuotes] = useState(false);
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  useEffect(() => {
    if (account.account?.email !== 'barathkumar.j@royalcyber.com' || account.account?.email !== 'aviral.awasthi@royalcyber.com') {
      const filterData = data?.quoteRequests?.results.filter(
        (element) => element.customer?.email === account.account?.email,
      );
      setUsers(filterData);
    } else {
      setUsers(data?.quoteRequests?.results);
    }
  }, [data]);
  // console.log('daaaaaaaaaaa', data);
  // console.log('quoteData', setQuoteData);

  const { addItem } = useCart();
  const handleShowQuotes = (data) => {
    setQuoteData(data);
    setOrder(!order);
    setShowQuotes(true);
  };
  const handleCart = (data, quantity) => {
    return addItem(data, quantity);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('BearerToken');
        const response = await fetch(
          `${process.env.commercetools_hostUrl}/${process.env.commercetools_projectKey}/quotes`,
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
          console.log(responseData, 'responseData');

          const totalPrices = responseData.results.map((result) => result.totalPrice.centAmount);
          console.log(totalPrices, 'totalPrices');
          const Qs = responseData.results.map((result) => result.quoteState);
          console.log(Qs, 'Qs');

          // Store the first total price in state
          if (totalPrices.length > 0) {
            setTotalPrices(totalPrices[0]);
          }

          // Store quote data for reference
          setQuoteInfo(responseData.results[0]); // Assuming you want to store the first quoteData
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {order ? (
        <>
          <div className="quotes-approval-container bg-gray-100 flex">
            <div className="details-container ml-7 mt-2">
                <div> <span className="back-button" onClick={() => handleShowQuotes()}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </span></div>
              <div className='mb-5 ml-5'>
             <div><span className="text-base">
                <b>State:</b> {quoteData.quoteRequestState}
              </span></div>
              <div><span className="text-base">
                <b>Employee Email:</b> {quoteData?.customer?.email}
              </span></div>
              <div><span>
                <b>Total Price:</b> {quoteData?.lineItems[0]?.totalPrice?.centAmount / 100}{' '}
                {quoteData?.lineItems[0]?.totalPrice?.currencyCode}
              </span></div></div>
              
            </div>
            <div className='ml-80 '>
            {quoteData.quoteRequestState == 'Accepted' || quoteData.quoteRequestState == 'Rejected' ? (
              <div className="aprrove-decline-container  text-base">
                <button
                  className="text-base rounded-lg w-full mt-2 bg-rc-brand-primary py-2 px-5 text-sm text-white duration-300 hover:opacity-80  hover:drop-shadow-md"
                  onClick={() => {
                    handleCart(quoteData.lineItems[0].variant, quoteData.lineItems[0].quantity);
                    router.push('/checkout');
                  }}
                >
                  {console.log(quoteData.lineItems[0].variant, 'quoteData.lineItems[0].variant')}
                  Order Now
                </button>
              </div>
            ) : (
              <div className="aprrove-decline-container bg-rc-brand-primary mt-2 text-white w-40 rounded-lg py-2 px-2">
                <b>
                  <p className="text-base">Wait For Approval</p>
                </b>
              </div>
            )}</div>
          </div>

          <div className="h-15 w-full">
            <div className="head-div mt-5">
              <b>Quote Details :</b>
            </div>
            <table className="min-w-full">
              <thead className="border-b-4">
                <tr>
                  <th className="px-2 py-4 text-left text-base font-medium text-gray-900 lg:px-6">Product</th>
                  <th className="hidden px-2 py-4 text-left text-base font-medium text-gray-900 lg:block lg:px-6">
                    Price
                  </th>
                  <th className="px-2 py-4 text-left text-base font-medium text-gray-900 lg:px-6">Quantity</th>
                  <th className="hidden px-2 py-4 text-left text-base font-medium text-gray-900 lg:block lg:px-6">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {quoteData.lineItems.map((data) => (
                  <>
                    <tr className="border-b">
                      <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                        {data.nameAllLocales?.filter((d) => d.locale === 'en-GB')[0]?.value}
                      </td>
                      <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6 lg:text-base">
                        {data.price.value.centAmount / 100} {data.price.value.currencyCode}
                      </td>
                      <td className="padding-bottom px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                        {data.quantity}
                      </td>
                      <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6 lg:text-base">
                        {data.totalPrice.centAmount / 100} {data.totalPrice.currencyCode}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <br />
            <div className="comment-div">
              <b>Comments :</b>
            </div>
            <br />
            <p className="text-base">{quoteData.comment}</p>
          </div>
        </>
      ) : (
        <>
        <div className="space-y-1 ml-1 pl-5 py-4 border-b-4">
          <h3 className="text-lg font-medium leading-6 text-black dark:text-light-100">
            {formatAccountMessage({ id: 'orders.history', defaultMessage: 'My Quotes history' })}
          </h3>
          <p className="max-w-2xl text-sm text-gray-600 pb-4">
            {formatAccountMessage({
              id: 'orders.desc',
              defaultMessage: 'Check the status of recent quotes, manage returns, and download invoices.',
            })}
          </p>
        </div>
        <table className="max-w-full min-w-full">
          <thead className="border-b-4">
            <tr className="text-sm">
              <th className="px-2 py-4 text-left font-medium text-gray-900 lg:px-6">Employee Email</th>
              <th className="hidden px-2 py-4 text-left font-medium text-gray-900 lg:block lg:px-6">Quote Status</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">Comments</th>
              {/* {account.account?.email === 'barathkumar.j@royalcyber.com' || account.account?.email === 'mahaveer@royalcyber.com' && (
                <th className="hidden px-2 py-4 text-left font-medium text-gray-900 lg:block lg:px-6">Address</th>
              )} */}
              <th className="px-2 py-4 text-left font-medium text-gray-900 lg:px-6">Created Date</th>
              <th className="hidden px-2 py-4 text-left font-medium text-gray-900 lg:block lg:px-6">Updated Date</th>
              <th className="px-2 py-4 text-left font-medium text-gray-900 lg:px-6">View Details</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((val) => (
                <tr key={val.id} className="border-b">
                  <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                    {val.customer?.email}
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                    {val.quoteRequestState}
                  </td>
                  <td className="px-2 py-4 text-sm font-light text-gray-900 lg:text-base">{val.comment}</td>
                  {/* {account.account?.email === 'barathkumar.j@royalcyber.com' || account.account?.email === 'aviralawasthi@gmail.com' && (
                    <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                      {val.shippingAddress.streetNumber} {val.shippingAddress.streetName}, {val.shippingAddress.city},{' '}
                      {val.shippingAddress.country}
                    </td>
                  )} */}
                  <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                    {val.createdAt.split('T')[0]}
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                    {val.lastModifiedAt.split('T')[0]}
                  </td>
                  <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                    <span className="eye-icon" onClick={() => handleShowQuotes(val)}>
                      <FontAwesomeIcon icon={faEye} />
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table></>
        
      )}
    </>
  );
}
export default MyQuote;