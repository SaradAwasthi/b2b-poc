import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@Types/product/Product';
import { Variant } from '@Types/product/Variant';
// import ProductDetails, { UIProduct, UIColor, UISize } from 'components/commercetools-ui/products/product-details';
import { useCart } from 'frontastic';
import { addToWishlist } from 'frontastic/actions/wishlist';
import { ApolloProvider } from 'react-apollo';
import ApolloCilent from 'apollo-boost';
import ProductDetails, { UIProduct, UISize } from 'components/commercetools-ui/ProductDetails';

const client = new ApolloCilent({
  uri: 'https://ms-gateway-f4b4o225iq-ue.a.run.app/graphql',
});

function productDetailsTastic({ data }) {
  const router = useRouter();
  const { product }: { product: Product } = data.data.dataSource;
  const [currentVariantIdx, setCurrentVariantIdx] = useState<number>();
  const [variant, setVariant] = useState<Variant>(product.variants[0]);
  const [prod, setProd] = useState<UIProduct>();
  const { addItem } = useCart();

  if (!product || !variant) return null;
  // 🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈
  // feel free to add a map if there are later
  // more colors missing (or add to tailwind conf)
  const grayFix = (word: string) => (word === 'grey' ? 'gray' : word);

  // just two main features for now, colors and sizes.
  // we pick a unique list from the payload to build the
  // selector
  // Upon selecting a feature, color or size, we find the
  // selected variant from the list based on the selected
  // features..

  // console.log('products,', product.variants);

  const sizes = [
    ...new Map(product.variants?.map((v: Variant) => [v.attributes.clrr, v.attributes.clrr])).values(),
  ] as UISize[];

  const sizes1 = [...new Map(product.variants?.map((v: Variant) => [v.attributes.sze, v.attributes.sze])).values()];

  // console.log('Flexpp', sizes);
  // console.log('Shaftpp', sizes1);

  useEffect(() => {
    if (!currentVariantIdx) {
      const currentVariantSKU = router.asPath.split('/')[3];
      const currentVariantIndex = product?.variants.findIndex(({ sku }) => sku == currentVariantSKU);
      setVariant(product.variants[currentVariantIndex]);
    }
  }, [currentVariantIdx]);

  useEffect(() => {
    const currentProd: UIProduct = {
        name: product.name,
        // add variants as well, so we can select and filter
        variants: product.variants,
        price: variant.price,
        // rating: 4,
        images: variant.images?.map((img: string, id: number) => ({
            id: `${variant.sku}-${id}`,
            src: img,
            alt: variant.sku,
        })),

        sizes,
          sizes1,
        description: `
        <p>${product.description || ''}</p>
      `,

        details: [
            {
                name: 'Features',
                items: [
                    variant.attributes.designer && `Designer: ${variant.attributes.designer.label}`,
                    variant.attributes.gender && `Collection: ${variant.attributes.gender.label}`,
                    variant.attributes.madeInItaly && `Made in Italy`,
                ],
            },
        ],
        // colors: []
    };

    setProd(currentProd);
  }, [variant]);

  const handleAddToCart = (variant: Variant, quantity: number): Promise<void> => {
    return addItem(variant, quantity);
  };

  const handleAddToWishList = () => {
    addToWishlist(variant.sku, 1);
  };

  return (
    <ApolloProvider client={client}>
      <ProductDetails
        product={prod}
        onAddToCart={handleAddToCart}
        variant={variant}
        onChangeVariantIdx={setCurrentVariantIdx}
        onAddToWishlist={handleAddToWishList}
      />
    </ApolloProvider>
  );
}

export default productDetailsTastic;
