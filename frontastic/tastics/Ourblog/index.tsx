import React from 'react';
import Blog, { Props } from 'components/commercetools-ui/content/blog';
// import { AmplienceLoader } from 'frontastic/lib/image/index1';


const BlogTastic = ({ data }) => {
  const blog = data?.data?.dataSource as Props;
console.log("bog :", blog);
  if (!blog) return <></>;

  return <Blog blog={blog} //   imageLoader={AmplienceLoader} 
  />;
};

export default BlogTastic;
