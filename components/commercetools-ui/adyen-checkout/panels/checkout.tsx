import { useEffect, useState } from 'react';
import AdyenCheckout from '@adyen/adyen-web';
import { useCart, useAdyen } from 'frontastic';
import '@adyen/adyen-web/dist/adyen.css';
import toast from 'react-hot-toast';
import { useAccount } from 'frontastic';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

type Session = {
  id: string;
  sessionData: string;
};

type SessionConfig = {
  environment: string;
  clientKey: string;
  session: Session;
};

const Checkout = () => {
  const { data: cartList } = useCart();
  const { createSession } = useAdyen();
  const [session, setSession] = useState<Session>();
    const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState(null);
const { loggedIn, account } = useAccount();
const paypalAmount = cartList?.sum?.centAmount / 100;

  const [paymentStatus, setPaymentStatus] = useState();

  // const initializeSession = async (sessionConfiguration: SessionConfig) => {
  //   const checkout = await AdyenCheckout(sessionConfiguration);
  //   checkout.create('dropin').mount('#dropin-container');
  // };

  useEffect(() => {
    const host = typeof window !== 'undefined' ? window.location.origin : '';

    createSession(cartList?.sum?.centAmount, cartList?.sum?.currencyCode, `${host}/thank-you`).then((res) => {
      const { id, sessionData } = res;

      setSession({ id, sessionData });
    });
  }, [cartList, createSession]);

  // useEffect(() => {
  //   if (session) {
  //     const sessionConfiguration = {
  //       //For demo swiss we allways set to test environment
  //       environment: 'test',
  //       //environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
  //       clientKey: 'test_VDRCU3ALS5GMDC45GLZGUF6ANM3P75ZK',
  //       session,
  //       onPaymentCompleted: (result, component) => {
  //         console.log(result);

  //         if (result === 'Authorised') {
  //         }
  //       },
  //       onError: (error, component) => {
  //         console.log(error);

  //         toast.error(error);
  //       },
  //     };

  //     initializeSession(sessionConfiguration);
  //   }
  // }, [session]);

  const sendEmail = async () => {
    try {
      const apiUrl = 'https://sendgrid-notification-app-f4b4o225iq-uc.a.run.app/email/notifications';
      const requestBody = {
        toEmail: account?.email,
        subject: 'Order confirmation',
        body: 'Thank you for placing your order with us.',
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
const handleSectionClick = () => {
    sendEmail();
  };


//PayPal
 const createOrder = (data, actions) => {
    console.log('createOrder', actions?.order);

    // Implement logic to create an order on the server
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: paypalAmount,
          },
        },
      ],
    });
  };

 const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      console.log('Payment Status', details?.status);
      setPaymentStatus(details?.status);

      if (details?.status === 'COMPLETED') {
        payPalPayment();
      }

      console.log('Transaction completed by ' + details.payer.name.given_name);
    });
  };

  const payPalPayment = () => {
    const token = localStorage.getItem('BearerToken');
    const bodyData = { id: cartList?.cartId, version: parseInt(cartList?.cartVersion) };

    fetch("https://api.us-central1.gcp.commercetools.com/rc_b2b_shop_july_2023/orders", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(bodyData),
    }).then((res) => {
      res.json().then((orderData) => {
        const orderId = orderData.id;
        const orderVersion = orderData?.version;
        const totalPrice = orderData?.totalPrice?.centAmount;
        const currencyCode = orderData?.totalPrice?.currencyCode;
        const timeStamp = orderData?.createdAt;
console.log("OrderData", orderData)
        const paymentData = {
          amountPlanned: {
            currencyCode: currencyCode,
            centAmount: totalPrice,
          },

          paymentMethodInfo: {
            paymentInterface: 'PayPal',
            method: 'PayPal',
          },
          paymentStatus: {
            interfaceCode: 'SUCCESS',
            interfaceText: 'We got the money.',
          },
          transactions: [
            {
              timestamp: timeStamp,
              type: 'Charge',
              amount: {
                currencyCode: currencyCode,
                centAmount: totalPrice,
              },
              state: 'Success',
            },
          ],
        };

        fetch("https://api.us-central1.gcp.commercetools.com/rc_b2b_shop_july_2023/payments", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(paymentData),
        }).then((paymentRes) => {
          paymentRes.json().then((paymentData) => {
            const paymentId = paymentData.id;
            const paymentBody = {
              version: orderVersion,
              actions: [
                {
                  action: 'addPayment',
                  payment: {
                    typeId: 'payment',
                    id: paymentId,
                  },
                },
              ],
            };

            fetch(`https://api.us-central1.gcp.commercetools.com/rc_b2b_shop_july_2023/orders/${orderId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify(paymentBody),
}).then((orderRes) => {
    if (!orderRes.ok) {
      throw new Error('Network response was not ok');
    }
    return orderRes.json();
  })
  .then((orderUpdate) => {
    if (orderUpdate && orderUpdate.versionModifiedAt) {
      console.log('Payment updated successfully!');
      localStorage.setItem('showRecentOrder', 'true');
      setTimeout(() => {
        window.location.href = 'account#orders';
      }, 500);
    } else {
      throw new Error('Invalid response from server');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle the error appropriately, such as displaying an error message to the user.
  });
          });
        });
      });
    });
  };
  return (
    
    <>
      <div>
        <div>
          <h2 className="mt-5 mb-8">
            <b className="text-center text-2xl">Select Payment Type</b>
          </h2>

          {/* <Paypal paypalAmount={paypalAmount} sendDataToParent={undefined} /> */}
          {/* <label>
            <input type="radio" name="pay" value="adyen" className="mr-5" />
            Adyen
            <section
              id="dropin-container"
              aria-labelledby="cart-heading"
              className="mt-5 mb-5 bg-white md:rounded md:shadow-md lg:col-span-7"
              onClick={handleSectionClick}
            ></section>
          </label> */}
        </div>
        {/* <label>
          <div>
            <input type="radio" name="pay" value="cash" className="mr-5" />
            Cash On Delivery
          </div>
          <div className="custom-div">
            <button
              type="button"
              onClick={() => {
                onPaymentCompleted();
                sendEmail();
              }}
              className="custom-button bg-gray-900 text-white hover:bg-gray-500"
            >
              Pay
            </button>
          </div>
        </label> */}
        <label>
          <div className="mt-5 mb-8">
            <input type="radio" name="pay" value="cash" className="mr-5" />
            PayPal
          
          <div className="mt-5 mb-8">
            <PayPalScriptProvider
              options={{
                clientId: 'AX4TJKdmnKjxlspZB4KNC93z9AEQYmA1mOsCUkjLqN6nhGij44GmODGhvHy25QqAxy-YnoD6XSS2b2gk',
                currency: 'GBP',
              }}
            >
              <div className="App">
                <PayPalButtons
                  createOrder={(data, actions) => createOrder(data, actions)}
                  onApprove={(data, actions) => onApprove(data, actions)}
                />
              </div>
            </PayPalScriptProvider>
          </div>
          </div>
        </label>
      </div>
    </>
  );
};

export default Checkout;
