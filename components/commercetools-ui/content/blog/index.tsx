import React from 'react';
import { ImageLoader } from 'next/image';
// import { AmplienceScheme } from 'types/Amplience';
import Image, { NextFrontasticImage } from 'frontastic/lib/image';
export interface Props {
  blog?:any;
}

const Blog: React.FC<Props> = ({ blog }) => {
console.log("Blog: ", blog.fields)
  return (
    <div className="w-full">
      <h4 className="py-2 text-center dark:text-white "> {blog.fields.title} <button className="text-center font-bold dark:text-white"> {blog.fields.buttonText}</button></h4>
      
      {/* <div className="relative h-[10px] w-[280px]">
        <Image src={banner} objectFit="cover" layout="fill" className="rounded-sm" loader={imageLoader} />
      </div>
      <p className="box-border pt-4 pr-4 dark:text-white">{summary}</p> */}
    </div>
  );
};

export default Blog;
