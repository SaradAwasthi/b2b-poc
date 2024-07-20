import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function OrderSummary(props) {
  const { summaryData, checkRedirect } = props;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackRedirect = () => {
    if(!!checkRedirect){
      window.location.href = "/account"
    }else{
      props.orderState();
    }
  };

  return (
    <>
      <div className="quotes-approval-container">
        <div className="summary-details-container ml-12">
          <span className="back-button col-md-1" onClick={() => handleBackRedirect()}>
            <FontAwesomeIcon icon={faArrowLeft} />
            
          </span>
          <span className="col-md-8 w-1/2 ml-28">
            <span className="address-display">
              <b>Customer Name:</b> 
              &nbsp; {summaryData.shippingAddress.firstName} {summaryData.shippingAddress.lastName}
            </span>

            <span className="address-display">
                <b>Order ID:</b>&nbsp; {summaryData.cartId}
            </span>
            
            <span className="address-display">
                <b>Order State:</b>&nbsp; {summaryData.orderState}
            </span>
            
            {/* <span className="address-display">
                <b>Order Number:</b>&nbsp; {summaryData.orderNumber ? summaryData.orderNumber : '1234'}
            </span> */}
            
            {/* <span className="address-display">
                <b>Created At:</b>&nbsp; {summaryData.createdAt}
            </span> */}
          </span>
          <span className="col-md-8 w-1/2 ">
           
            <span className="address-display">
              <b>Street Name:</b>&nbsp; {summaryData.shippingAddress.streetName}
            </span>
            <span className="address-display">
              <b>City:</b>&nbsp; {summaryData.shippingAddress.city}
            </span>
            <span className="address-display">
              <b>Country:</b>&nbsp; {summaryData.shippingAddress.country}
            </span>
          </span>
        </div>
      </div>
      <div className="h-15 w-full">
        <div className="head-div">
          <p className="ordersummaryalign mb-4">Order Summary</p>
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
            {summaryData.lineItems.map((data) => (
              <>
                <tr className="border-b">
                  <td className="px-2 py-4 text-sm font-light text-gray-900 lg:px-6 lg:text-base">{data.name}</td>
                  <td className="hidden whitespace-nowrap px-2 py-4 text-sm font-light text-gray-900 lg:block lg:px-6 lg:text-base">
                    {data?.price?.centAmount / 100} {data?.price?.currencyCode}
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
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OrderSummary;