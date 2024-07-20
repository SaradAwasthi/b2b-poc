import ProductSlider from 'components/commercetools-ui/products/slider';

function ProductSliderTastic({ data }) {
  if (!data?.data?.dataSource?.items) return <p>No products found.</p>;
  console.log("Data : ", data?.data?.dataSource)

  return (
    <ProductSlider
      products={data.data.dataSource.items}
      title={data.title}
      ctaLabel={data.ctaLabel}
      ctaLink={data.ctaLink}
    />
  );
}

export default ProductSliderTastic;
