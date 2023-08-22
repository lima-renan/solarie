const baseURL = process.env.REACT_APP_URL_BASE_BACKEND;
const baseURL_dev = "/api";

//auth url
export const SIGNUP_URL = `${baseURL}/user/signup`; 
export const LOGIN_URL =  `${baseURL}/user/login`;
export const REFRESH_URL = `${baseURL}/user/refreshToken`;

//products url

export const PRODUCTS_URL = `${baseURL}/products`;
export const PRODUCT_URL = `${baseURL}/product`;

//category url
export const CATEGORIES_URL = `${baseURL}/categories`;

//cart url
//export const CART_URL = `${baseURL_dev}/user/cart`;
export const CART_URL = `${baseURL}/user/cart`;

//wishlist url
export const WISHLIST_URL = `${baseURL}/user/wishlist`;
