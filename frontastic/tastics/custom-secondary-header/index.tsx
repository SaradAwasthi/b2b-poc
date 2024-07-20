import Typography from 'components/commercetools-ui/typography';
import { ReferenceLink } from 'helpers/reference';
import React from 'react';

export default function SecondaryHeader({ data }) {
//   console.log(data.links);
  return (
    <div className="fixed-screen-width lg:relative-width flex items-center justify-center bg-[#E5EEED] py-4 gap-10">
      {data.links.map((link, id) => (
        <ReferenceLink
          key={id}
          target={link.reference}
          className="flex items-center text-md font-medium text-gray-500 hover:text-gray-900 dark:text-light-100"
        >
          <Typography>{link.name}</Typography>
        </ReferenceLink>
      ))}
    </div>
  );
}
