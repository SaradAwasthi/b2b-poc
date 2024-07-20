import { useState, useEffect, Key, ReactChild, ReactFragment, ReactPortal, ReactNode } from 'react';
import Image from 'next/image';
import { Disclosure, RadioGroup, Tab } from '@headlessui/react';
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline';
import { Money } from '@Types/product/Money';
import { Variant } from '@Types/product/Variant';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import WishlistButton from './wishlist-button';
import { useMutation } from 'react-apollo';
import { useAccount, useCart } from 'frontastic';


// import { CREATE_QUOTE } from '../../account/details/sections/GraphQL/Queries';
import { useRouter } from 'next/router';
import { Attributes } from '@Types/product/Attributes';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface Props {
  product: UIProduct;
  onAddToCart: (variant: Variant, quantity: number) => Promise<void>;
  onAddToWishlist: (variant: Variant, num: number) => void;
  variant: Variant;
  onChangeVariantIdx: (idx: number) => void;
}

export type UIProduct = {
  name: string;
  variants: Variant[];
  price: Money;
  images: UIImage[];

  sizes: UISize[];
  sizes1: UISize[];

  description: string;
  details: UIDetail[];
};
interface UIImage {
  id: string;
  src: string;
  alt: string;
}
export interface UIColor {
  name: string;
  key: string;
  bgColor: string;
  selectedColor: string;
}
export interface UISize {
  label: string;
  key: string;
}
interface UIDetail {
  name: string;
  items: string[];
}

export default function ProductDetail({ product, onAddToCart, onAddToWishlist, variant, onChangeVariantIdx }: Props) {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedShaft, setselectedShaft] = useState(null);
  const [selectedcolor, setselectedcolor] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);
  const [validateAttributes, setvalidateAttributes] = useState<boolean>(false);
  // const [selectedAttributes, setSelectedAttributes] = useState({});
  const [updateFlag, setUpdateFlag] = useState(false);
  // const [selectedVariant, setSelectedVariant] = useState(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [selectedVariantPrice, setSelectedVariantPrice] = useState(null);
  const { data, removeItem, shippingMethods, setShippingMethod, updateCart, orderCart } = useCart();
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariantImage, setSelectedVariantImage] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { account } = useAccount();
  let variantAvailableAttributes: Attributes;

  useEffect(() => {
    const idx = product?.variants.findIndex((v: Variant) => v.attributes.size?.key === selectedSize?.key);

    onChangeVariantIdx(idx === -1 ? 0 : idx);
  }, [selectedSize, selectedShaft, onChangeVariantIdx, product?.variants]);

  // console.log('productpdp,', product?.variants);
  // console.log('Product details SKU,', product?.variants[0].sku);

  const checkAttributesValidations = async (attribute: string, value: any) => {
    setSelectedAttributes((prevState) => {
      const updatedAttributes = { ...prevState, [attribute]: value };
      return updatedAttributes;
    });

    const variant = product?.variants.find((variant) => {
      for (const key in variant.attributes) {
        if (variant.attributes[key] !== selectedAttributes[key]) {
          return false;
        }
      }
      return true;
    });

    if (variant) {
      setSelectedVariant(variant);
    }
  };

  // Initialize the selected variant when the component mounts
  useEffect(() => {
    const initialVariant = product?.variants.find((variant) => {
      for (const key in variant.attributes) {
        if (variant.attributes[key] !== selectedAttributes[key]) {
          return false;
        }
      }
      return true;
    });

    if (initialVariant) {
      setSelectedVariant(initialVariant);
    }
  }, []);

  const updateSelectedVariant = () => {
    const variant = product?.variants.find((variant) => {
      for (const key in variant.attributes) {
        if (variant.attributes[key] !== selectedAttributes[key]) {
          return false;
        }
      }
      return true;
    });

    if (variant) {
      // console.log('Selected Variant:', variant);

      const formattedPrice = CurrencyHelpers.formatForCurrency(variant.price);

      setSelectedVariant(variant);
      setSelectedVariantPrice(formattedPrice);

      // Set the selected variant image URL
      setSelectedVariantImage(variant.images[0]); // Assuming the first image is the variant's image
    } else {
      // console.log('No variant found with selected attributes.');
      setSelectedVariant(null);
      setSelectedVariantPrice(null);
      setSelectedVariantImage(''); // Reset the image URL
    }
  };

  useEffect(() => {
    updateSelectedVariant();
  }, [selectedAttributes]);

  // console.log(selectedAttributes, 'selectedAttributes');

  const isButtonDisabled = () => {
    if (variant?.offers) {
      return false
    }
    if (!selectedVariant) {
      // console.log('Variant not selected.');
      return true;
    }

    const availableAttributes = Object.keys(selectedVariant.attributes);
    const selectedAttributesKeys = Object.keys(selectedAttributes);

    if (availableAttributes.length !== selectedAttributesKeys.length) {
      // console.log('Not all attributes are selected.');
      return true;
    }

    for (const key of selectedAttributesKeys) {
      if (!availableAttributes.includes(key) || selectedAttributes[key] !== selectedVariant.attributes[key]) {
        // console.log(`Attribute mismatch for ${key}.`);
        return true;
      }
    }

    if (!selectedVariant.isOnStock) {
      // console.log('Variant is out of stock.');
      return true;
    }

    return false;
  };

  useEffect(() => {
    setSelectedSize(variant?.attributes?.clrr);

    setselectedShaft(variant?.attributes?.sze);

    setSelectedAttributes(variant.attributes);
  }, []);

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.isOnStock) return;
    setLoading(true);

    const latestAttributes = {
      Flex: selectedSize,

      Shaft: selectedShaft,
    };

    const updatedVariant = {
      ...selectedVariant,
      attributes: latestAttributes,
    };

    onAddToCart(updatedVariant, productQuantity).then(() => {
      setLoading(false);
      setAdded(true);
      updateCart({
        billing: account?.addresses.find((address) => address.isDefaultBillingAddress) ?? {},
        shipping: account?.addresses.find((address) => address.isDefaultShippingAddress) ?? {},
      });
    });
  };

  const handleAddToWishlist = (variant: Variant) => {
    onAddToWishlist(variant, 1);
  };

  useEffect(() => {
    variantAvailableAttributes = variant.attributes;
    if (added) {
      setTimeout(() => {
        setAdded(false);
      }, 1000);
    }
  }, [added]);
  const router = useRouter();


  //   const [createQuote, setCreateQuote] = useState({
  //     currency: '',
  //     employeeId: '',
  //     employeeEmail: '',
  //     companyId: '',
  //     lineItems: [],
  //   });

  //   const [createQuoteCheck, setCreateQuoteCheck] = useState(false);

  //   const [CreateQuoteDraft] = useMutation(CREATE_QUOTE, {
  //     variables: {
  //       draft: {
  //         currency: createQuote.currency,
  //         employeeId: createQuote.employeeId,
  //         employeeEmail: createQuote.employeeEmail,
  //         companyId: createQuote.companyId,
  //         lineItems: createQuote.lineItems,
  //       },
  //     },
  //   });

  //   useEffect(() => {
  //     if (!!createQuoteCheck) {
  //       CreateQuoteDraft().then((res) => {
  //         router.push({
  //           pathname: 'home/createquote',
  //           query: {
  //             quoteId: res.data.createQuote.id,
  //             quoteVersion: res.data.createQuote.version,
  //             productName: product.name,
  //             productPrice: product.price.centAmount,
  //             productCurrency: product.price.currencyCode,
  //             quantity: 1,
  //             singlePage: true,
  //           },
  //         });
  //       });
  //       setCreateQuoteCheck(false);
  //     }
  //   }, [createQuote, CreateQuoteDraft]);

  //   const handleQuote = () => {
  //     const quotesData = {
  //       currency: 'EUR',
  //       employeeId: account.accountId,
  //       employeeEmail: account.email,
  //       companyId: '16168d70-9709-11ed-b3ad-b5cc2dc3e428',
  //       lineItems: [],
  //     };
  //     quotesData.lineItems.push({
  //       sku: product.variants[0].sku,
  //       quantity: 1,
  //       variantId: Number(product.variants[0].id),
  //     });
  //     setCreateQuote(quotesData);
  //     setCreateQuoteCheck(true);
  //   };

  return (
    <div className='overflow-hidden'>
      <div className="fixed-screen-width lg:relative-width">
        <div className="my-10 flex flex-1 justify-center flex-col px-6 lg:flex-row lg:px-10">
          {/* Image gallery */}
          <Tab.Group>
            <div className="flex justify-center w-full max-w-[648px] flex-col px-28">
              {/* Image selector */}
              {/* <div className="mx-auto mb-2 hidden w-full max-w-xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {product?.images?.map((image) => (
                    <Tab
                      key={image.id}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-white/50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only">{image.alt}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Image
                              loader={({ src }) => src}
                              layout="fill"
                              src={image.src}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? 'ring-primary-100' : 'ring-transparent',
                              'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2',
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div> */}

              <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
                {product?.images?.map((image) => (
                  <Tab.Panel key={image.id}>
                    <Image
                      loader={({ src }) => src}
                      layout="fill"
                      src={selectedVariantImage || image.src} // Use selectedVariantImage if available, otherwise default to product image
                      alt={image.alt}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
              <br />
              <div className="mx-auto mb-2 hidden w-full max-w-xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {product?.images?.map((image) => (
                    <Tab
                      key={image.id}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-white/50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only">{image.alt}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Image
                              loader={({ src }) => src}
                              layout="fill"
                              src={image.src}
                              alt=""
                              className="h-full w-full object-cover object-center max-w-[320px]"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? 'ring-primary-100' : 'ring-transparent',
                              'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2',
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </div>

          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 flex flex-col flex-1 sm:mt-16 sm:px-0 lg:mx-10 lg:mt-0 max-w-[640px]">
            <div className="flex justify-between text-2xl 
                          font-bold  text-gray-900 dark:text-light-100">
              <h1 className="h1tag">{product?.name}</h1>
              <WishlistButton variant={variant} onAddToWishlist={onAddToWishlist} />
            </div>
            <div className="custom-container mt-10">
              <h1 className="text-xl font-medium">Product Description</h1>
              <div
                className="text-base dark:text-light mt-5 space-y-6 "
                dangerouslySetInnerHTML={{ __html: product?.description }}
              ></div>
              <h2 className="sr-only">
                {formatProductMessage({ id: 'product?.info', defaultMessage: 'Product information' })}
              </h2>
            </div>

            {variant.offers ?
              //MiraklPrice
              (variant.offers.map((offer: {
                shopName: ReactNode;
                currency: ReactNode; price: boolean | ReactChild | ReactFragment | ReactPortal;
              }, index: Key) => {
                return <div><div className="text-base text-primary-100 lg:text-2xl mt-6 mb-2 justify-between flex w-full flex-row items-center  rounded-lg bg-white pr-[35px]" key={index}>
                  <div className="font-bold text-2xl text-gray-900" >{offer.currency}&nbsp;{offer.price}</div>
                  <div className="font-medium text-xl">New</div>
                  <div className="font-medium text-base " style={{ color: "#666971", width: "100px" }}>
                    Qty  <input className="w-[50px] h-10 rounded-md" type="number"
                      placeholder="1"
                    />

                    <br />
                    Sold By:<b className="text-gray-900">{offer.shopName}</b>
                  </div>
                  <div className='text-xl text-center text-white'>
                    <button className="bg-rc-brand-primary" style={{ borderWidth: "3px", borderStyle: "outset", lineHeight: "normal", borderRadius: "8px", height: "50px", width: "140px" }}>Add to Cart</button>
                  </div>
                </div>
                  <hr />
                </div>
              }))

              //CommercetoolPrice
              :
              (<div className='flex flex-col'>
                <div className="text-base text-primary-100 lg:text-2xl mt-6 mb-2 flex w-full flex-row items-center justify-between rounded-lg bg-white pr-[35px] p-6">

                  {variant.discountedPrice ? (
                    <span className="pr-1 line-through">{CurrencyHelpers.formatForCurrency(variant.price)}</span>
                  ) : null}

                  {CurrencyHelpers.formatForCurrency(variant.discountedPrice || variant.price)}
                </div>

                <div className="mt-6 mb-2 flex w-full flex-row items-center justify-between rounded-lg bg-white ">
                  <div className="flex flex-col items-end gap-2 lg:gap-5 w-full">
                    <div className="flex flex-col items-center justify-between gap-2 lg:flex-row lg:gap-4 w-full p-6">
                      <div className="flex h-6 w-32 items-center justify-center gap-2">
                        <label htmlFor="custom-input-number" className="w-full text-sm font-semibold text-gray-700">
                          {/* Quantity */}
                        </label>
                        <div className="relative mt-1 flex h-10 w-full flex-row rounded-lg bg-transparent">
                          <button
                            onClick={() => {
                              productQuantity > 0 ? setProductQuantity(productQuantity - 1) : null;
                            }}
                            className=" h-full w-20 cursor-pointer rounded-l bg-white-300  bg-rc-brand-primary text-white hover:opacity-80"
                          >
                            <span className="m-auto text-2xl font-thin">−</span>
                          </button>
                          <input
                            className="text-md md:text-basecursor-default flex w-full items-center bg-white-300 text-center font-semibold text-gray-700  outline-none outline-none hover:text-black focus:text-black  focus:outline-none"
                            value={productQuantity}
                          ></input>
                          <button
                            onClick={() => {
                              setProductQuantity(productQuantity + 1);
                            }}
                            className="h-full w-20 cursor-pointer rounded-r bg-white-300  bg-rc-brand-primary text-white hover:opacity-80"
                          >
                            <span className="m-auto text-2xl font-thin">+</span>
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`${isButtonDisabled()
                          ? 'cursor-not-allowed bg-gray-700'
                          : 'hover:bg-rc-brand-primary hover:text-white uppercase hover:drop-shadow-md'
                          } mt-1 h-10 rounded bg-white border-[1px] border-rc-brand-primary px-6 text-sm text-black duration-300 lg:px-4`}
                        disabled={isButtonDisabled()}
                      >
                        {!loading && !added && (
                          <>
                            {(variant.isOnStock || variant.offers)
                              ? formatProductMessage({ id: 'bag.add', defaultMessage: 'Add to bag' })
                              : formatProductMessage({ id: 'outOfStock', defaultMessage: 'Out of stock' })}
                          </>
                        )}

                        {loading && (
                          <svg className="h-6 w-6 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                            <path
                              d="M8,8.5A3.5,3.5,0,1,1,4.5,5,3.5,3.5,0,0,1,8,8.5ZM4.5,14A3.5,3.5,0,1,0,8,17.5,3.5,3.5,0,0,0,4.5,14Zm16-2A3.5,3.5,0,1,0,17,8.5,3.5,3.5,0,0,0,20.5,12Zm0,2A3.5,3.5,0,1,0,24,17.5,3.5,3.5,0,0,0,20.5,14Zm-8,4A3.5,3.5,0,1,0,16,21.5,3.5,3.5,0,0,0,12.5,18Zm0-18A3.5,3.5,0,1,0,16,3.5,3.5,3.5,0,0,0,12.5,0Z"
                              fill="#fff"
                            />
                          </svg>
                        )}
                        {!loading && added && (
                          <svg className="h-6 w-6" fill="#fff" viewBox="0 0 80.588 61.158">
                            <path
                              d="M29.658,61.157c-1.238,0-2.427-0.491-3.305-1.369L1.37,34.808c-1.826-1.825-1.826-4.785,0-6.611
                     c1.825-1.826,4.786-1.827,6.611,0l21.485,21.481L72.426,1.561c1.719-1.924,4.674-2.094,6.601-0.374
                     c1.926,1.72,2.094,4.675,0.374,6.601L33.145,59.595c-0.856,0.959-2.07,1.523-3.355,1.56C29.746,61.156,29.702,61.157,29.658,61.157z
                     "
                            />
                          </svg>
                        )}
                      </button>
                      {/* {console.log('')} */}
                    </div>
                  </div>
                </div>
              </div>)

            }

            {isButtonDisabled() && (
              <span className="pl-1 text-sm text-red-500">* This product is currently out of stock</span>
            )}

            <div className="mt-9">
              <h3 className="sr-only">
                {formatProductMessage({ id: 'product?.desc', defaultMessage: 'Description' })}
              </h3>
            </div>
            <div>
              <form>
                {/* /////   Flex  */}
                {product?.sizes.length > 1 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-medium text-gray-900 dark:text-light-100">
                        {formatProductMessage({ id: 'clrr', defaultMessage: 'Color' })}
                      </h2>
                    </div>

                    <RadioGroup
                      value={selectedSize}
                      onChange={(e) => {
                        setSelectedSize(e);
                        checkAttributesValidations('clrr', e);
                      }}
                      className=""
                    >
                      <RadioGroup.Label className="sr-only">Choose a Flex</RadioGroup.Label>
                      <div className="inline-grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {product?.sizes?.map((clrr: { label: string; key: string }) => (
                          <RadioGroup.Option
                            key={clrr.label}
                            value={clrr}
                            className={`flex cursor-pointer items-center justify-center border py-1 px-3 
                                      text-xs rounded-md font-medium sm:flex-1 
                  ${selectedSize === clrr
                                ? ' dark:text-light-200 text-gray-900 hover:bg-gray-700 '
                                : 'border-gray-200 bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white'
                              }
                  ${selectedSize === clrr && 'bg-gray-700 text-white'}`}
                          >
                            {/* {console.log('selectedflex', selectedSize)} */}
                            <RadioGroup.Label>
                              <p>{clrr}</p>
                            </RadioGroup.Label>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* /////    Shaft  */}
                {product?.sizes1?.length > 1 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-medium text-gray-900 dark:text-light-100">
                        {formatProductMessage({ id: 'sze', defaultMessage: 'Size' })}
                      </h2>
                    </div>

                    <RadioGroup
                      value={selectedShaft}
                      onChange={(e) => {
                        setselectedShaft(e);
                        checkAttributesValidations('sze', e);
                      }}
                      className="mt-2"
                    >
                      <RadioGroup.Label className="sr-only">Choose a Flex</RadioGroup.Label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {product?.sizes1?.map((sze: { label: string; key: string }) => (
                          <RadioGroup.Option
                            key={sze?.label}
                            value={sze}
                            className={`text-sm flex cursor-pointer items-center rounded-md justify-center 
                                      border py-1 px-1 font-medium sm:flex-1 
                              ${selectedShaft === sze
                                ? 'dark:text-light-200 text-gray-900'
                                : 'border-gray-200 bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white'
                              }
                              ${selectedShaft === sze && 'bg-gray-700 text-white'}`}
                          >
                            {console.log('selectedshaft', selectedShaft)}
                            <RadioGroup.Label>
                              <p>{sze?.label}</p>
                            </RadioGroup.Label>
                            <p>{sze}</p>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="custom-container mt-6">
        <h1 className="text-primary text-4xl ">Product Description</h1>
        <div
          className="text-primary dark:text-light mt-8 space-y-6 text-lg"
          dangerouslySetInnerHTML={{ __html: product?.description }}
        ></div>
        <h2 className="sr-only">
          {formatProductMessage({ id: 'product?.info', defaultMessage: 'Product information' })}
        </h2>
      </div> */}
    </div>
  );
}