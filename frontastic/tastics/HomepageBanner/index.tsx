
import ContentfulBanner from 'components/commercetools-ui/ContentfulBanner';
import React from 'react';

const HomePageBannerTastic = ({data}) => {
  // console.log("Data:", data)
    const fields = data.data?.dataSource?.fields;
  // console.log("ContentfulBlogTastic : ", fields?.bannerImage?.fields?.file)
const bannerImageUrl = fields?.bannerImage?.fields?.file?.url; // Replace this with the actual URL from your data
  const bannerAltText = "Banner Image Alt Text"; // Replace this with the appropriate alt text for accessibility
 const bannerTitle = "Treat. Prevent."; // Replace this with the actual banner title from your data
  const bannerSubTitle = "Your Complete Migraine Care"; // Replace this with the actual banner subtitle from your data

  return (
    <>
    
      {/* <pre className="mt-2 text-lg">{JSON.stringify(data?.data?.dataSource, null, 2)}</pre> */}
      <ContentfulBanner imageUrl={bannerImageUrl} altText={bannerAltText} bannerTitle={bannerTitle} bannerSubTitle={bannerSubTitle} />
    </>
  )
}

export default HomePageBannerTastic
