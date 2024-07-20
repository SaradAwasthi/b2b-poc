import { MouseEvent, useState, useEffect } from 'react';
import { Cart } from '@Types/cart/Cart';
import { LineItem } from '@Types/cart/LineItem';
import { useTranslation, Trans } from 'react-i18next';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference, ReferenceLink } from 'helpers/reference';
import DiscountForm from '../discount-form';
// import { useMutation } from '@apollo/client';
// import { CREATE_QUOTE } from '../account/details/sections/GraphQL/Queries';
import { useRouter } from 'next/router';
import { Discount } from '@Types/cart/Discount';

interface Props {
  readonly cart: Cart;
  readonly onSubmit?: (e: MouseEvent) => void;
  readonly submitButtonLabel?: string;
  readonly disableSubmitButton?: boolean;
  readonly showSubmitButton?: boolean;
  readonly showDiscountsForm?: boolean;

  termsLink?: Reference;
  cancellationLink?: Reference;
  privacyLink?: Reference;
}

const OrderSummary = ({
  cart,
  onSubmit,
  showSubmitButton = true,
  showDiscountsForm = true,
  submitButtonLabel,
  disableSubmitButton,
  termsLink,
  cancellationLink,
  privacyLink,
}: Props) => {
  //i18n messages
  const router = useRouter();
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { t } = useTranslation(['checkout']);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const submitButtonClassName = `${disableSubmitButton ? 'pointer-events-none my-2' : ''} ${
    !showDiscountsForm ? 'mt-7' : ''
  } rounded-full bg-primary-100 py-4 mx-10 text-sm text-white duration-300 hover:opacity-80 hover:drop-shadow-md `;

  const interpolatedComponents = [
    <ReferenceLink key={0} className="cursor-pointer font-medium text-accent-500 hover:underline" target={termsLink} />,
    <ReferenceLink
      key={1}
      className="cursor-pointer font-medium text-accent-500 hover:underline"
      target={cancellationLink}
    />,
    <ReferenceLink
      key={2}
      className="cursor-pointer font-medium text-accent-500 hover:underline"
      target={privacyLink}
    />,
  ];

  const totalTaxes = cart?.taxed?.taxPortions?.reduce((a, b) => a + b.amount.centAmount, 0);

  const productPrice = cart?.lineItems?.reduce((a, b: LineItem) => {
    if (b.discountedPrice) {
      return a + b.discountedPrice.centAmount * b.count;
    } else {
      return a + b.price.centAmount * b.count;
    }
  }, 0);

  const discountPrice = cart?.lineItems?.reduce((a, b) => {
    return (
      a +
      b.count *
        b.discounts.reduce((x, y) => {
          return x + y.discountedAmount.centAmount;
        }, 0)
    );
  }, 0);

  const [createQuote, setCreateQuote] = useState({
    type: '',
    id: '',
    version: 0,
    comment: '',
  });

//   const [createQuoteCheck, setCreateQuoteCheck] = useState(false);
//   const [comment, setComment] = useState('');
//   const [CreateQuoteDraft] = useMutation(CREATE_QUOTE, {
//     variables: {
//       draft: {
//         cart: {
//           typeId: createQuote.type,
//           id: createQuote.id,
//         },
//         cartVersion: createQuote.version,
//         comment: createQuote.comment,
//       },
//     },
//   });

//   console.log(cart, 'DiscountForm');

//   useEffect(() => {
//     console.log('cart', cart?.lineItems);
//     if (!!createQuoteCheck) {
//       CreateQuoteDraft().then((res) => {
//         router.push({
//           pathname: 'home/createquote',
//           query: { quoteId: res.data.createQuoteRequest.id, quoteVersion: res.data.createQuoteRequest.version },
//         });
//       });
//       setCreateQuoteCheck(false);
//     }
//   }, [createQuote, CreateQuoteDraft]);

//   const handleQuote = () => {
//     const quotesData = {
//       type: 'cart',
//       id: cart?.cartId,
//       version: parseInt(cart?.cartVersion),
//       comment: comment,
//     };
//     console.log('Quote Data', quotesData);
//     setCreateQuote(quotesData);
//     setCreateQuoteCheck(true);
//   };

  return (
    <>
      <section
        aria-labelledby="summary-heading"
        className="bg-[#FFFFF] mt-4 rounded-lg border border-gray-300 py-10 px-4 lg:mt-0 lg:ml-5 lg:py-16"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-2xl text-gray-600">
            {formatCartMessage({ id: 'subtotal', defaultMessage: 'Subtotal' })}({cart?.lineItems?.length} Items)
          </p>
          <p className="text-2xl font-medium text-gray-900">
            {CurrencyHelpers.formatForCurrency(cart?.lineItems?.[0]?.totalPrice.centAmount)}
          </p>
        </div>

        {cart?.shippingInfo && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="flex items-center text-sm text-gray-600">
              <span>{formatCartMessage({ id: 'shipping.estimate', defaultMessage: 'Shipping estimate' })}</span>
            </dt>
            <dd className="text-sm font-medium text-gray-900">
              {CurrencyHelpers.formatForCurrency(cart?.shippingInfo?.price || {})}
            </dd>
          </div>
        )}
        {showDiscountsForm && <DiscountForm cart={cart} className="py-10" />}
        <div>
          {showSubmitButton && (
            <div className="display-buttons flex justify-center">
              <button type="submit" onClick={onSubmit} className={submitButtonClassName}>
                {submitButtonLabel || formatCartMessage({ id: 'checkout', defaultMessage: 'Checkout' })}
              </button>
              {/* {window?.location?.pathname !== '/checkout' && (
                <button type="button" onClick={() => handleQuote()} className={submitButtonClassName}>
                  Create Quote
                </button>
              )} */}
              {submitButtonLabel ===
                formatCartMessage({ id: 'ContinueAndPay', defaultMessage: 'Continue and pay' }) && (
                <p className="px-1 py-5 text-center text-xs">
                  <Trans i18nKey="disclaimer" t={t} components={interpolatedComponents} />
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      {window?.location?.pathname !== '/checkout' && (
        <section
          aria-labelledby="summary-heading"
          className="bg-[#FFFFF] mt-4 rounded-lg border border-gray-300 py-10 px-4 lg:mt-0 lg:ml-5 lg:py-16"
        >
          <div className="comment-div">
            <p>Comment</p>
          </div>
          {/* <textarea onChange={(e) => setComment(e.target.value)} value={comment} style={{ border: '1px solid gray' }} /> */}
        </section>
      )}
    </>
  );
};

export default OrderSummary;
