import { Variant } from '@Types/product/Variant';
import ProductList from 'components/commercetools-ui/ProductList';
import { useCart } from 'frontastic';

function ProductListTastic({ data }) {
  const { addItem } = useCart();
  if (!data) return <></>;

  const { items, facets, category, previousCursor, nextCursor, totalItems } = data.data.dataSource;
  const handleAddToCart = (variant: Variant, quantity: number): Promise<void> => {
    return addItem(variant, quantity);
  };
  return (
    <ProductList
      products={items}
      totalProducts={totalItems}
      facets={facets}
      category={category}
      previousCursor={previousCursor}
      nextCursor={nextCursor}
      onAddToCart={handleAddToCart}
    />
  );
}

export default ProductListTastic;
