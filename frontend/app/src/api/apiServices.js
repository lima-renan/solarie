import {
  CART_URL,
  CATEGORIES_URL,
  LOGIN_URL,
  PRODUCT_URL,
  PRODUCTS_URL,
  REFRESH_URL,
  SIGNUP_URL,
  WISHLIST_URL,
} from "./apiUrls";


export const loginService = (email, password) =>
  fetch(LOGIN_URL, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username:email, password }),

  });

// Atualiza o token do usuário logado
export const refreshTokenService = (token) =>
  fetch(REFRESH_URL, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  });

export const signupService = (firstName, lastName, gender, dayBday, monthBday, yearBday, email, password) =>
  fetch(SIGNUP_URL, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ firstName, lastName, gender, dayBday, monthBday, yearBday, username:email, email,password }),

  });

export const getAllProductsService = () => 
  fetch(PRODUCTS_URL, {
    method: "GET",
  });

export const getProductByIdService = (productId) =>
  fetch(`${PRODUCT_URL}/${productId}`,{
    method: "GET",
  });

//Carrega o carrinho
export const getCartItemsService = (token) =>
  fetch(CART_URL, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  });

export const postAddProductToCartService = (productId, token) =>
  fetch(CART_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });


export const deleteProductFromCartService = (productId, token, removeProduct) =>
  fetch(CART_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, removeProduct }),
  });

  export const clearCartService = (token) =>
  fetch(`${CART_URL}/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const getWishlistItemsService = (token) =>
  fetch(WISHLIST_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    });

export const postAddProductToWishlistService = (productId, token) =>
  fetch(
    WISHLIST_URL,{
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

export const deleteProductFromWishlistService = (productId, token) =>
  fetch(WISHLIST_URL,{
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  export const getAllCategoriesService = () => fetch(CATEGORIES_URL, {
    method: "GET",
  });


