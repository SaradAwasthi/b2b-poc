import AccountDetails from 'components/commercetools-ui/account/details';
import CartDetailsTastic from './CartDetails';
import HomePageBannerTastic from './HomepageBanner';
import productDetailsTastic from './ProductDetails';
import ProductListTastic from './ProductList';
import CheckoutTastic from './checkout';
// import ContentfulBlogTastic from './contentful-blog';
import Footer from './footer';
import Header from './headers';
import NotFound from './not-found';
import ProductSlider from './products/slider';
import CreateQuote from './Create-Quote';
import AccountLoginTastic from './account/login';
import BlogTastic from './Ourblog';
import AccountRegisterTastic from './account/register';
import PunchOut from './Punchout';

export const tastics = {
  //Header and Footer properties
  'commercetools/ui/header': Header,
  CTFooter: Footer,
  'commercetools/ui/footer': Footer, 

  //Home Page
  'commercetools/ui/products/slider': ProductSlider,
  homePageBanner: HomePageBannerTastic,

  //PLP page
  'commercetools/ui/products/product-list': ProductListTastic,
  'commercetools/ui/products/details': productDetailsTastic,

  //Checkout Page
  'commercetools/ui/cart': CartDetailsTastic,
  'commercetools/ui/checkout': CheckoutTastic,

  // Contentful page
  'contentful/blog': BlogTastic,
  'contentful/banner': HomePageBannerTastic,

  // Account details page
  'commercetools/ui/account/details': AccountDetails,
  'commercetools/ui/account/login': AccountLoginTastic,
  'commercetools/ui/account/register': AccountRegisterTastic,


  //  B2B Functionality
'commercetools/ui/createQuote': CreateQuote,


// PunchOut
'commercetools/ui/punchout': PunchOut,

  default: NotFound,
};
