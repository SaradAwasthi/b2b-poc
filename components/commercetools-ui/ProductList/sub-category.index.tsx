import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { headerNavigation } from 'helpers/mocks/mockData';

export default function SubCategories({ category }) {
  const filterCategory = category?.split(/[//]/)[1];
  const [categoryArr, setCategoryArr] = useState([]);
  useEffect(() => {
    // console.log(headerNavigation.categories, 'Header Categories');
    // const newArr = headerNavigation.categories.filter((el) => {
    //   return el.slug == filterCategory;
    // });
    const newCatArr = headerNavigation.categories.filter((item) => item.slug === 'rcshop');
    // console.log(newCatArr, 'new category array');
    setCategoryArr(newCatArr);
    
  }, [filterCategory]);

  return (
    <div className="w-80 border-r-2 border-t-2 border-gray-100 pt-6 pr-2">
      <div>
        <div className="">
          <div className="headerli">New Arrivals</div>
          <div className="subli">Tops</div>
          <div className="subli">Bottoms</div>
          <div className="subli">Active</div>
          <div className="subli">Swimwear</div>
          <div className="subli">Coats & Jackets</div>
          <div className="subli">Accessories</div>
          <div className="subli">Matching Sets</div>
          <div className="subli">Underwear</div>
          <div className="subli">Sleepwear</div>
          <div className="subli">Shoes</div>
          <div className="subli">Cologne & Body Care</div>
        </div>
      </div>
      <div>
        <ul>
          {/* {console.log(categoryArr, 'Cat Arr')} */}
          {categoryArr[0]?.childCategories.map((item) => (
            <li key={item.slug}>
              {/* <NextLink href={`/${filterCategory}/${item?.slug}`}> */}
              <NextLink href={`${item?.slug}`}>
                <button className="py-2 text-left text-lg font-light hover:text-gray-400">{item.name}</button>
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
