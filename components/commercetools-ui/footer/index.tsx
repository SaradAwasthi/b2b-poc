import React from 'react';
import Typography from 'components/commercetools-ui/typography';
import Column, { Link, Column as FooterColumn } from './column';
import { renderIcon } from './renderIcon';
import { Reference, ReferenceLink } from 'helpers/reference';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';
export interface Props {
  logo: { media: NextFrontasticImage } | NextFrontasticImage;
  columns: FooterColumn[];
  logoLink: Reference;
  copyright?: string;
  copyrightLinks?: Link[];
}

const Footer: React.FC<Props> = ({ logo, logoLink, columns, copyright, copyrightLinks }) => {
  
  console.log("Data Footer : ", logo);
  return (
    <footer aria-labelledby="footer-heading">
      <div className="footer-main-wrap mt-14">
        <div className="footer-left">
          <ReferenceLink target={logoLink} className="h-28 items-center py-4 pr-5 md:pt-1 md:pb-3">
                <span className="sr-only">Catwalk</span>
                <div className="relative h-full w-[60px] pr-5 sm:w-[240px] sm:pr-9" style={{minHeight: "90% !important"}}>
                  <Image
                    media={logo?.media ? logo?.media : { media: {} }}
                    className="dark:invert "
                    layout="fill"
                    objectFit="cover"
                    alt="Logo"
                  />
                </div>
              </ReferenceLink>
        </div>
        <div className="footer-right">
          <div className="flex flex-wrap justify-start xl:justify-evenly">
            {columns?.map((column, index) => (
              <div key={index} className="flex justify-start">
                <Column column={column} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {copyright && (
        <div className="copyright-bar flex place-content-between border-t border-gray-200 p-4 sm:px-10">
          <p className="text-xs text-white sm:text-sm">© {copyright}</p>
          <ul className="flex">
            {copyrightLinks?.map((item, i) => (
              <li key={i} className="text-xs">
                <p className="px-2 text-gray-300 hover:text-white sm:text-sm">
                  <Typography>{item.name}</Typography>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </footer>
  );
};

export default Footer;
