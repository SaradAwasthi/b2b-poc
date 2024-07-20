import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LOAD_USERS, UPDATE_QUOTE } from '../GraphQl/Quote_Queries';
import { useFormat } from 'helpers/hooks/useFormat';

function QuotesApproval() {
  const { data } = useQuery(LOAD_USERS, { variables: { limit: 500, sort: 'createdAt desc' } });
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
    if (!!ADQuote?.update) {
      updateQuote().then((response) => {
        if (!!response.data) {
          setADQuote({ id: '', version: 0, state: '', update: false });
          // window.location.href = window.location.href.split('#')[0] + '#myQuotes';
          window.location.reload();
        }
      });
    }
  }, [ADQuote]);

  const [users, setUsers] = useState([]);
  const [approvalQuotes, setApprovalQuotes] = useState(false);
  const [quoteData, setQuoteData] = useState([]);
const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  useEffect(() => {
    setUsers(data?.quoteRequests?.results);
  }, [data]);

  const handleShowQuotes = (data) => {
    setQuoteData(data);
    setApprovalQuotes(!approvalQuotes);
  };

  return (
    <>
      {approvalQuotes ? (
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
                <b>Employe Email:</b> {quoteData?.customer?.email}
              </span></div>
              <div><span>
                <b>Total Price:</b> {quoteData?.lineItems[0]?.totalPrice?.centAmount / 100}{' '}
                {quoteData?.lineItems[0]?.totalPrice?.currencyCode}
              </span></div></div>
              
            </div>
            <div className="aprrove-decline-container ml-80 py-3">
              <button className='text-base rounded-lg w-full mt-2 bg-rc-brand-primary py-2 px-5 text-sm text-white duration-300 hover:opacity-80  hover:drop-shadow-md '
                onClick={() =>
                  setADQuote({ id: quoteData.id, version: quoteData.version, state: 'Accepted', update: true })
                }
              >
                Accept
              </button>
              <button className='text-base rounded-lg w-full mt-2 bg-rc-brand-primary py-2 px-5 text-sm text-white duration-300 hover:opacity-80 hover:drop-shadow-md'
                onClick={() =>
                  setADQuote({ id: quoteData.id, version: quoteData.version, state: 'Rejected', update: true })
                }
              >
                Reject
              </button>
              
            </div>
          </div>
          
          <div className="h-15 w-full">
            {/* <div className="head-div">
              <p>Quote Details</p>
            </div> */}
            
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
                        {data.nameAllLocales.filter((d) => d.locale === 'en-GB')[0]?.value}
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
              <p>Comment</p>
            </div>
            <br />
            <p>{quoteData.comment}</p>
          </div>
        </>
      ) : (
        <>
        <div className="space-y-1 ml-1 pl-5 py-4 border-b-4">
          <h3 className="text-lg font-medium leading-6 text-black dark:text-light-100">
            {formatAccountMessage({ id: 'quote.history', defaultMessage: "Quotes Approval History.." })}
          </h3>
          <p className="max-w-2xl text-sm text-gray-600 pb-4">
            {formatAccountMessage({
              id: 'orders.desc',
              defaultMessage: 'Check the status of recent quotes, manage approve or reject quotes by seller.',
            })}
          </p>
        </div>
        <table className="max-w-full min-w-full">
          <thead className="">
            <tr className="text-sm border-b-4">
              {/* <th className="text-ba+se px-2 py-4 text-left font-medium text-gray-900 lg:px-6">Quote Number</th> */}
              <th className="px-2 py-4 text-left font-medium text-gray-900 lg:px-6">Employee Email</th>
              <th className="hidden px-2 py-4 text-left font-medium text-gray-900 lg:block lg:px-6">Quote State</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">Comments</th>
              <th className="px-6 py-4 text-left font-medium text-gray-900">Address</th>
              <th className="hidden px-2 py-4 text-left font-medium text-gray-900 lg:block lg:px-6">Total Price</th>
              <th className="px-2 py-4 text-left font-medium text-gray-900 lg:px-6">View Details</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map(
                (val) =>
                  val?.quoteRequestState === 'Submitted' && (
                    <tr key={val.id} className="border-b text-sm">
                      {/* <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">
                        {val.quoteNumber}
                      </td> */}
                      <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                        {val.customer?.email}
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                        {val.quoteRequestState}
                      </td>

                      <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">{val.comment}</td>
                      <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                        {val.shippingAddress.streetNumber} {val.shippingAddress.streetName}, {val.shippingAddress.city},{' '}
                        {val.shippingAddress.country}
                      </td>
                      <td className="lg:px-6e whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900">
                        {val?.lineItems[0]?.totalPrice?.centAmount / 100} {val?.lineItems[0]?.totalPrice?.currencyCode}
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:px-6">
                        <span className="eye-icon" onClick={() => handleShowQuotes(val)}>
                          <FontAwesomeIcon icon={faEye} />
                        </span>
                      </td>
                    </tr>
                  ),
              )}
          </tbody>
        </table>
        </>
      )}
    </>
  );
}
export default QuotesApproval;
