import React, { FC, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Order } from '@Types/cart/Order';
import Spinner from 'components/commercetools-ui/spinner';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import Image from 'frontastic/lib/image';
import OrderSummary from './OrderSummary';

export interface Props {
  orders?: Order[];
}

const OrdersHistory: FC<Props> = ({ orders }) => {
  const [accountOrdersState, setAccountOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [orderSummary, setOrderSummary] = useState(false);
  const [orderSummaryData, setOrderSummayData] = useState([]);
  const [checkRedirect, setCheckRedirect] = useState(false);
  //account data
  const { orderHistory } = useCart();

  useEffect(() => {
    if (orderHistory) {
      orderHistory().then((data) => {
        setAccountOrders(data);
        setLoading(false);
      });
    } else {
      setAccountOrders(orders);
      setLoading(false);
    }
  }, [orders, orderHistory]);
  //18in messages
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

const handleOrder = (data) => {
    setOrderSummayData(data);
    setOrderSummary(true);
  };

  return (
    <>
    {!orderSummary ? (
    <div>
      <div className="mt-10">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-light-100">
            {formatAccountMessage({ id: 'orders.history', defaultMessage: 'My order history' })}
          </h3>
          <p className="max-w-2xl text-sm text-gray-500">
            {formatAccountMessage({
              id: 'orders.desc',
              defaultMessage: 'Check the status of recent orders, manage returns, and download invoices.',
            })}
          </p>
        </div>
        <div className="divide-y divide-gray-200"></div>
        {loading ? (
          <div className="flex items-stretch justify-center py-10 px-12">
            <Spinner />
          </div>
        ) : accountOrdersState && accountOrdersState.length ? (
          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              Recent orders
            </h2>
            <div className="space-y-20">
              {accountOrdersState?.map((order) => (
                <div key={order.orderId}>
                  <h3 className="sr-only">
                    Order placed on <time dateTime={order.email}>{order.email}</time>
                  </h3>
                  <div className="rounded-lg bg-gray-100 py-6 px-4 sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                    <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-full lg:flex-none lg:gap-x-28">
                      <div className="flex justify-between pt-6 sm:block sm:pt-0">
                        <dt className="font-medium text-gray-900">
                          {formatAccountMessage({
                            id: 'orders.number',
                            defaultMessage: 'Order Number',
                          })}
                        </dt>
                        <dd className="sm:mt-1">{order.cartId}</dd>
                      </div>
                      <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                        <dt>
                          {formatAccountMessage({
                            id: 'orders.total.amount',
                            defaultMessage: 'Total amount',
                          })}
                        </dt>
                        <dd className="sm:mt-1">
                          {(+order.sum.centAmount / 100).toFixed(2)}
                          {order.lineItems[0].price.currencyCode}
                        </dd>
                      </div>
                      <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                        <dt>
                          {formatAccountMessage({
                            id: 'orders.status',
                            defaultMessage: 'Order status',
                          })}
                        </dt>
                        <dd className="sm:mt-1">{order.orderState}</dd>
                      </div>
                      <div className="flex text-sm font-bold font-medium text-gray-900 sm:pt-1">
                        <button type='button' className="w-full items-center bg-rc-brand-primary rounded-md border border-transparent px-0 text-center text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:bg-gray-300 sm:w-fit sm:px-8">
                          <dt className="summary-border" 
                          onClick={() => handleOrder(order)}
                          >
                              {formatAccountMessage({
                                id: 'orders.summary',
                                defaultMessage: 'Order summary',
                              })}
                          </dt>
                        </button>
                      </div>
                    </dl>
                    {/* <a
                      href={order.cartId}
                      className="mt-6 flex w-full items-center justify-center rounded-md border border-accent-400 bg-white py-2 px-4 text-sm font-medium text-accent-400 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto"
                    >
                      {formatAccountMessage({
                        id: 'orders.view.invoice',
                        defaultMessage: 'View invoice',
                      })}
                      <span className="sr-only">for order {order.cartId}</span>
                    </a> */}
                  </div>

                  <table className="mt-4 w-full text-gray-500 sm:mt-6">
  <caption className="sr-only">
    {formatProductMessage({
      id: 'products',
      defaultMessage: 'Products',
    })}
  </caption>
  <thead className="sr-only text-left text-sm text-gray-800 sm:not-sr-only">
    <tr>
      <th scope="col" className="hidden py-3 pr-8 font-normal dark:text-light-100 sm:table-cell text-center">
        {formatProductMessage({
          id: '',
          defaultMessage: 'Product Image',
        })}
      </th>
      <th scope="col" className="hidden py-3 pr-8 font-normal dark:text-light-100 sm:table-cell text-center">
        {formatProductMessage({
          id: '',
          defaultMessage: 'Product Name',
        })}
      </th>
      <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal dark:text-light-100 sm:table-cell text-center">
        {formatProductMessage({
          id: '',
          defaultMessage: 'Total Price',
        })}
      </th>
      <th scope="col" className="hidden py-3 pr-8 font-normal dark:text-light-100 sm:table-cell text-center">
        {formatProductMessage({
          id: '',
          defaultMessage: 'Total Quantity',
        })}
      </th>
      <th scope="col" className="hidden py-3 pr-8 font-normal dark:text-light-100 sm:table-cell text-center">
        {formatProductMessage({
          id: 'product.info',
          defaultMessage: 'Product information',
        })}
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
    {order.lineItems.map((product) => (
      <tr key={product.lineItemId} className="table-row">
        <td className="py-6 pr-8 text-center">
          <div className="flex items-center">
            <Image
              src={product.variant.images[0]}
              alt={product.name}
              className="mr-6 h-16 w-16 rounded object-cover object-center"
            />
          </div>
        </td>
        <td className="hidden py-6 pr-8 dark:text-light-100 sm:table-cell text-center">{product.name}</td>
        <td className="hidden py-6 pr-8 dark:text-light-100 sm:table-cell text-center">
          {(product.totalPrice.centAmount / 100).toFixed(2)} {product.price.currencyCode}
        </td>
        <td className="hidden py-6 pr-8 dark:text-light-100 sm:table-cell text-center">{product.count}</td>
        <td className="whidden py-6 pr-8 dark:text-light-100 sm:table-cell text-center">
          <NextLink href={product._url || ''}>
            <a className="text-accent-400">
              {formatProductMessage({
                id: 'product.view',
                defaultMessage: 'View product',
              })}
              <span className="sr-only">, {product.name}</span>
            </a>
          </NextLink>
        </td>
      </tr>
    ))}
  </tbody>
</table>

                </div>
              ))}
            </div>
          </section>
        ) : (
          <p className="mt-10 max-w-2xl text-sm text-gray-500">
            {formatAccountMessage({
              id: 'orders.no.orders',
              defaultMessage: 'You have not placed any orders yet! ',
            })}
          </p>
        )}
      </div>
    </div>
    ) : (
        <OrderSummary
          checkRedirect={checkRedirect}
          orderState={() => setOrderSummary(false)}
          summaryData={orderSummaryData}
        />
      )}
      </>
  );
  
};

export default OrdersHistory;
