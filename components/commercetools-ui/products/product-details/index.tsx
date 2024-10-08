import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Disclosure, RadioGroup, Tab } from '@headlessui/react';
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline';
import { Money } from '@Types/product/Money';
import { Variant } from '@Types/product/Variant';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import WishlistButton from './wishlist-button';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export interface Props {
  product: UIProduct;
  onAddToCart: (variant: Variant, quantity: number) => Promise<void>;
  onAddToWishlist: () => void;
  variant: Variant;
  onChangeVariantIdx: (idx: number) => void;
}

export type UIProduct = {
  name: string;
  variants: Variant[];
  price: Money;
  images: UIImage[];
  colors: UIColor[];
  sizes: UISize[];
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
  //i18n messages
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const [selectedColor, setSelectedColor] = useState<UIColor>(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState<UISize>();
  const [loading, setLoading] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);

  // changes the selected variant whenever
  // one of the attributes changes and
  // notifies the wrapping tastic via
  // the onChangeVariantIdx handler
  useEffect(() => {
    const idx = product?.variants.findIndex(
      (v: Variant) =>
        v.attributes.color?.key === selectedColor?.key && v.attributes.commonSize?.key === selectedSize?.key,
    );

    onChangeVariantIdx(idx === -1 ? 0 : idx);
  }, [selectedColor, selectedSize, onChangeVariantIdx, product?.variants]);

  const handleAddToCart = (variant: Variant, quantity: number) => {
    if (!variant.isOnStock) return;
    setLoading(true);
    onAddToCart(variant, quantity).then(() => {
      setLoading(false);
      setAdded(true);
    });
  };

  useEffect(() => {
    if (added) {
      setTimeout(() => {
        setAdded(false);
      }, 1000);
    }
  }, [added]);
  return (
    <div>
      <div className="fixed-screen-width lg:relative-width">
        <div className="h-16 w-full bg-[#F6FCFC]">
          <p className="pt-8 pl-6 font-normal">Active Pharmaceutical Ingredients / Antibiotics / Paracetamol</p>
        </div>
        <div className="h-16 w-full bg-[#E5EEED]">
          <p className="pl-8 pt-1 text-lg font-semibold">Paracetamol/Injectable</p>
        </div>
        <div className="my-10 flex flex-row px-10">
          {/* Image gallery */}
          <Tab.Group>
            <div className="flex basis-[25%] flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-xl sm:block lg:max-w-none">
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
                              selected ? 'ring-accent-400' : 'ring-transparent',
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

              <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
                {product?.images?.map((image) => (
                  <Tab.Panel key={image.id}>
                    <Image
                      loader={({ src }) => src}
                      layout="fill"
                      src={image.src}
                      alt={image.alt}
                      className="w-full object-cover object-center sm:rounded-lg"
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </div>
          </Tab.Group>

          {/* Product info */}
          <div className="mx-10 mt-10 basis-[45%] sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="flex items-center justify-between text-2xl font-bold tracking-tight text-gray-900 dark:text-light-100">
              {product?.name}
              <WishlistButton variant={variant} onAddToWishlist={onAddToWishlist} />
            </h1>

            <div className="mt-3">
              <div
                className="space-y-6 text-base text-gray-700 dark:text-light-100"
                dangerouslySetInnerHTML={{ __html: product?.description }}
              />
              <h2 className="sr-only">
                {formatProductMessage({ id: 'product?.info', defaultMessage: 'Product information' })}
              </h2>
              {/* <p className="text-accent-400 text-3xl">{CurrencyHelpers.formatForCurrency(product?.price)}</p> */}
            </div>

            <div className="mt-6">
              <h3 className="sr-only">
                {formatProductMessage({ id: 'product?.desc', defaultMessage: 'Description' })}
              </h3>
            </div>
            <div className="my-14">
              <ul className="grid grid-cols-3 gap-4">
                <li>
                  <p className="text-sm font-bold">Purity Percentage</p>
                  <p className="text-sm font-normal">{product?.variants[0]?.attributes?.Purity_Percentage}</p>
                </li>
                <li>
                  <p className="text-sm font-bold">Innovator Brand</p>
                  <p className="text-sm font-normal">{product?.variants[0]?.attributes?.Innovator_Brand}</p>
                </li>
                <li>
                  <p className="text-sm font-bold">Standards</p>
                  <p className="text-sm font-normal">{product?.variants[0]?.attributes?.Standards}</p>
                </li>
                <li>
                  <p className="text-sm font-bold">API Technology</p>
                  <p className="text-sm font-normal">{product?.variants[0]?.attributes?.API_Technology}</p>
                </li>
                <li>
                  <p className="text-sm font-bold">Dose Form</p>
                  <p className="text-sm font-normal">{product?.variants[0]?.attributes?.Dose_Form}</p>
                </li>
                <li>
                  <p className="text-sm font-bold">Supplier</p>
                  <p className="text-sm font-normal">{product?.variants[0]?.attributes?.Supplier}</p>
                </li>
              </ul>
            </div>
            <div className="mt-10 flex h-[125px] w-full flex-row items-center justify-between bg-white px-10">
              <div>
                <p className="text-md pb-3 font-normal">100 mg</p>
                <p className="text-lg font-bold">{CurrencyHelpers.formatForCurrency(product?.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-5">
                <a href="#" className="font-normal text-rc-brand-primary underline">
                  Request for sample
                </a>
                <div className="flex flex-row gap-3">
                  <span className="flex items-center justify-between gap-6 rounded-lg bg-gray-100 py-2 px-6 text-black">
                    Quantity
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      className="bi bi-chevron-down"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                      />
                    </svg>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(variant, 1)}
                    className="rounded-full bg-rc-brand-primary py-2 px-10 text-sm text-white duration-300 hover:bg-gray-100 hover:text-black hover:drop-shadow-md"
                    disabled={!variant.isOnStock}
                  >
                    {!loading && !added && (
                      <>
                        {variant.isOnStock
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
                </div>
              </div>
            </div>
            {/* Colors */}
            {/* <form className="mt-6">
              <div>
                <h3 className="dark:text-light-100 text-sm font-medium text-gray-900">
                  {formatProductMessage({ id: 'color', defaultMessage: 'Color' })}
                </h3>

                <RadioGroup value={selectedColor} onChange={setSelectedColor} className="mt-2">
                  <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                  <div className="flex items-center space-x-3">
                    {product?.colors?.map(
                      (color: { name: string; bgColor: string; selectedColor: string; key: string }) => (
                        <RadioGroup.Option
                          key={color.name}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              color.selectedColor,
                              (active && checked) || selectedColor?.key === color.key
                                ? 'ring-2 ring-accent-400 ring-offset-1'
                                : '',
                              !active && checked ? 'ring-2 ring-accent-400 ring-offset-1' : '',
                              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none',
                            )
                          }
                        >
                          <RadioGroup.Label>
                            <p className="sr-only">{color.name}</p>
                          </RadioGroup.Label>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              color.bgColor,
                              'h-8 w-8 rounded-full border border-black border-opacity-10',
                            )}
                          />
                        </RadioGroup.Option>
                      ),
                    )}
                  </div>
                </RadioGroup>
              </div>
              {product?.sizes.length > 1 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="dark:text-light-100 text-sm font-medium text-gray-900">
                      {formatProductMessage({ id: 'size', defaultMessage: 'Size' })}
                    </h2>
                  </div>

                  <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mt-2">
                    <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {product?.sizes?.map((size: { label: string; key: string }) => (
                        <RadioGroup.Option
                          key={size.label}
                          value={size}
                          className={({ active, checked }) =>
                            classNames(
                              active || selectedSize?.key == size.key ? 'ring-2 ring-accent-400 ring-offset-2' : '',
                              checked
                                ? 'bg-transparent text-gray-900 hover:bg-gray-50 dark:text-light-100'
                                : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                              'flex cursor-pointer items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1',
                            )
                          }
                        >
                          <RadioGroup.Label>
                            <p>{size.label}</p>
                          </RadioGroup.Label>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="mt-10 flex sm:flex-1">
                <button
                  type="button"
                  onClick={() => handleAddToCart(variant, 1)}
                  className="flex w-full flex-1 items-center justify-center rounded-md border border-transparent bg-accent-400 py-3 px-8 text-base font-medium text-white hover:bg-accent-500 focus:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-gray-400"
                  disabled={!variant.isOnStock}
                >
                  {!loading && !added && (
                    <>
                      {variant.isOnStock
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
              </div>
            </form> */}
          </div>

          {/* Add to cart CARD */}
          <div className="basis-[25%]">
            <div className="flex justify-center">
              <div className="block w-full max-w-sm rounded-lg bg-white text-left shadow-lg">
                <div className="px-6 pt-3 text-xl font-bold">{CurrencyHelpers.formatForCurrency(product?.price)}</div>
                <div className="p-6">
                  <h5 className="mb-2 text-xl font-medium text-gray-900">{product?.name}</h5>
                  <div className="my-6 flex items-center justify-around">
                    <p className="text-base text-gray-700">100 mg</p>
                    <span className="flex items-center justify-between gap-6 rounded-lg bg-gray-100 p-3 text-black">
                      Quantity
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="currentColor"
                        className="bi bi-chevron-down"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="mt-10 flex flex-col gap-2 sm:flex-1">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(variant, 1)}
                      className="rounded-full bg-rc-brand-primary py-2 px-5 text-sm text-white duration-300 hover:bg-gray-100 hover:text-black hover:drop-shadow-md"
                      disabled={!variant.isOnStock}
                    >
                      Request for qoute
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(variant, 1)}
                      className="rounded-full border border-rc-brand-primary bg-white py-2 px-5 text-sm text-black duration-300 hover:bg-gray-700 hover:text-white hover:drop-shadow-md"
                      disabled={!variant.isOnStock}
                    >
                      {!loading && !added && (
                        <>
                          {variant.isOnStock
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
                  </div>
                </div>
                <div className="border-t border-gray-300 py-3 px-6 text-gray-600">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(variant, 1)}
                    className="w-full rounded-full border-rc-brand-primary py-2 px-5 text-sm text-white duration-300 hover:bg-gray-100 hover:text-black hover:drop-shadow-md"
                    disabled={!variant.isOnStock}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Dropdown */}
        <section aria-labelledby="details-heading" className="my-2 bg-[#E5EEED] px-10">
          <h2 id="details-heading" className="sr-only">
            {formatProductMessage({ id: 'details.additional', defaultMessage: 'Additional details' })}
          </h2>

          {product?.details?.length > 0 && (
            <div className="divide-y divide-gray-200 border-t">
              {product?.details?.map((detail) => (
                <Disclosure key={detail.name}>
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(
                              open ? 'text-accent-400' : 'text-gray-900 dark:text-light-100',
                              'text-sm font-medium',
                            )}
                          >
                            {detail.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusSmIcon
                                className="block h-6 w-6 text-accent-400 group-hover:text-accent-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel>
                        <div className="prose prose-sm py-6 dark:text-light-100">
                          <ul role="list">
                            {detail.items?.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          )}
        </section>
        <section aria-labelledby="details-heading" className="my-2 bg-[#E5EEED] px-10">
          <h2 id="details-heading" className="sr-only">
            {formatProductMessage({ id: 'details.additional', defaultMessage: 'Additional details' })}
          </h2>

          {product?.details?.length > 0 && (
            <div className="divide-y divide-gray-200 border-t">
              {product?.details?.map((detail) => (
                <Disclosure key={detail.name}>
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(
                              open ? 'text-accent-400' : 'text-gray-900 dark:text-light-100',
                              'text-sm font-medium',
                            )}
                          >
                            {detail.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusSmIcon
                                className="block h-6 w-6 text-accent-400 group-hover:text-accent-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel>
                        <div className="prose prose-sm py-6 dark:text-light-100">
                          <ul role="list">
                            {detail.items?.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          )}
        </section>
        <section aria-labelledby="details-heading" className="my-2 bg-[#E5EEED] px-10">
          <h2 id="details-heading" className="sr-only">
            {formatProductMessage({ id: 'details.additional', defaultMessage: 'Additional details' })}
          </h2>

          {product?.details?.length > 0 && (
            <div className="divide-y divide-gray-200 border-t">
              {product?.details?.map((detail) => (
                <Disclosure key={detail.name}>
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(
                              open ? 'text-accent-400' : 'text-gray-900 dark:text-light-100',
                              'text-sm font-medium',
                            )}
                          >
                            {detail.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusSmIcon
                                className="block h-6 w-6 text-accent-400 group-hover:text-accent-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel>
                        <div className="prose prose-sm py-6 dark:text-light-100">
                          <ul role="list">
                            {detail.items?.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
