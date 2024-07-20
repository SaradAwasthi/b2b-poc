import { MouseEvent, useEffect, useState } from 'react';
import { Cart } from '@Types/cart/Cart';
import { LineItem } from '@Types/cart/LineItem';
import { useTranslation, Trans } from 'react-i18next';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference, ReferenceLink } from 'helpers/reference';
import DiscountForm from '../discount-form';
import { useMutation } from '@apollo/client';
import { CREATE_QUOTE } from '../account/details/sections/GraphQl/Quote_Queries';
import { useRouter } from 'next/router';

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

  const submitButtonClassName = `${disableSubmitButton ? 'opacity-75 pointer-events-none' : ''} ${!showDiscountsForm ? '' : ''
    } rounded-full bg-rc-brand-primary p-4 w-full text-sm text-white duration-300 hover:bg-gray-100 hover:text-black hover:drop-shadow-md`;

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

  // Create Quote Functionality
  const [comment, setComment] = useState('');
  const [createQuote, setCreateQuote] = useState({
    type: '',
    id: '',
    version: 0,
    comment: '',
  });

  const [createQuoteCheck, setCreateQuoteCheck] = useState(false);
  const [CreateQuoteDraft] = useMutation(CREATE_QUOTE, {
    variables: {
      draft: {
        cart: {
          typeId: createQuote.type,
          id: createQuote.id,
        },
        cartVersion: createQuote.version,
        comment: createQuote.comment,
      },
    },
  });

  console.log(cart, 'DiscountForm');

  useEffect(() => {
    console.log('cart', cart?.lineItems);
    if (!!createQuoteCheck) {
      CreateQuoteDraft().then((res) => {
        router.push({
          pathname: 'home/createquote',
          query: { quoteId: res.data.createQuoteRequest.id, quoteVersion: res.data.createQuoteRequest.version },
        });
      });
      setCreateQuoteCheck(false);
    }
  }, [createQuote, CreateQuoteDraft]);

  const handleQuote = () => {
    const quotesData = {
      type: 'cart',
      id: cart?.cartId,
      version: parseInt(cart?.cartVersion),
      comment: comment,
    };
    console.log('Quote Data', quotesData);
    setCreateQuote(quotesData);
    setCreateQuoteCheck(true);
  };

  return (
    <>
      <section className="w-full md:w-96 flex flex-col justify-center items-center space-y-4 p-4 bg-white shadow-md rounded-lg">
  {showDiscountsForm && <DiscountForm cart={cart} className="py-6" />}

  {cart?.shippingInfo && (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
      <dt className="text-sm text-gray-600">
        {formatCartMessage({ id: 'shipping.estimate', defaultMessage: 'Shipping estimate' })}
      </dt>
      <dd className="text-sm font-medium text-gray-900">
        {CurrencyHelpers.formatForCurrency(cart?.shippingInfo?.price || {})}
      </dd>
    </div>
  )}

  {showSubmitButton && (
    <div className="w-full flex justify-center">
      <button
        type="submit"
        onClick={onSubmit}
        className="w-full py-3 text-white bg-rc-brand-primary hover:bg-rc-brand-primary-dark rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-rc-brand-primary"
      >
        {submitButtonLabel || formatCartMessage({ id: 'checkout', defaultMessage: 'Checkout' })}
      </button>
    </div>
  )}
</section>

      {window?.location?.pathname !== '/checkout' && (
        <section
          aria-labelledby="summary-heading"
          className="bg-[#FFFFF] text-black mt-4 rounded-lg border border-gray-300 py-10 px-4 lg:py-4 w-96"
        >
          <div className="">
            <p>Comments</p>
          </div>
          <textarea onChange={(e) => setComment(e.target.value)} value={comment} style={{ border: '1px solid gray', width: '-webkit-fill-available' }} />
          {window?.location?.pathname !== '/checkout' && (
            <button type="button" onClick={() => handleQuote()} className="w-fit border-rc-brand-primary border-[1px] py-2 px-6 hover:bg-rc-brand-primary hover:text-white my-2 rounded-full">
              Create Quote
            </button>
          )}
        </section>
      )}
    </>
  );
};

export default OrderSummary;
