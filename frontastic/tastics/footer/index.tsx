import React from 'react';
import Footer from 'components/commercetools-ui/footer';
import Highlights from 'components/commercetools-ui/footer/highlights';

const FooterTastic = ({ data }) => {
  const logoLink = data?.logoLink
  const columns = [
    {
      header: data.headerCol1,
      links: data.linksCol1,
      icon: data.iconCol1,
    },
    {
      header: data.headerCol3,
      links: data.linksCol3,
      icon: data.iconCol3,
    },
    {
      header: data.headerCol2,
      links: data.linksCol2,
      icon: data.iconCol2,
    },
  ];

  return (
    <div className="mr-9 w-full">
      <Footer logo={data.logo} logoLink={logoLink} columns={columns} copyright={data.copyright} copyrightLinks={data.copyrightLinks} />
    </div>
  );
};

export default FooterTastic;
