import { createContext, useEffect, useReducer, useState } from "react";
import { initialState, cartReducer } from "../../reducers/cartReducer";
import {
  clearCartService,
  deleteProductFromCartService,
  getCartItemsService,
  postAddProductToCartService,
} from "../../api/apiServices";
import { actionTypes } from "../../utils/actionTypes";
import { useAuthContext, useProductsContext } from "..";
import { notify } from "../../utils/utils";

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const { token } = useAuthContext();
  const { updateInCartOrInWish, clearCarted } = useProductsContext();
  const [loadingCart, setLoadingCart] = useState(false);
  const [disableCart, setDisableCart] = useState(false);

  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (token) {
      setLoadingCart(true);
      (async () => {
        try {
          const cartRes = await getCartItemsService(token);
          const dataCart = await cartRes.json()

          if (cartRes.status === 200) {
            dispatch({
              type: actionTypes.INITIALIZE_CART,
              payload: dataCart.cart,
            });
          }
        } catch (err) {
          console.log(err);
          notify(
            "error",
            err?.response?.data?.errors
              ? err?.response?.data?.errors[0]
              : err?.response?.data?.message
          );
        } finally {
          setLoadingCart(false);
        }
      })();
    }
  }, [token]);

  const addProductToCart = async (product) => {
    setDisableCart(true);
    try {
      const productAlreadyInCart = state.cart.some((item) => item.product === product._id);
      const response = await postAddProductToCartService(product._id, token);
      if (response.status === 200 || response.status === 201) {
        if (productAlreadyInCart) {
          // Se o produto já estiver no carrinho, atualiza apenas a quantidade desse produto
          dispatch({
            type: actionTypes.UPDATE_PRODUCT_QTY_IN_CART,
            payload: state.cart.map((item) =>
              (item.product === product._id) || (item._id === product._id)  ? { ...item, qty: item.qty + 1 } : item
            ),
          });
          updateInCartOrInWish(product._id, "inCart", true);
          notify("success", "Produto Adicionado à Bag");
        } else {
          // Caso contrário, adiciona o produto como um novo item no carrinho
          dispatch({
            type: actionTypes.ADD_PRODUCT_TO_CART,
            payload: [{ ...product, qty: 1 }, ...state.cart],
          });
          updateInCartOrInWish(product._id, "inCart", true);
          notify("success", "Produto Adicionado à Bag");
        }
      }
    } catch (err) {
      console.log(err);
      notify(
        "error",
        err?.response?.data?.errors
          ? err?.response?.data?.errors[0]
          : "Algum Erro Ocorreu!!"
      );
    } finally {
      setDisableCart(false);
    }
  };

  const updateProductQtyInCart = async (productId, type) => {
    setDisableCart(true);
    try {
      const removeProduct = false; // não remove o produto da bag
      let response;

      if (type === "increment") {
        response = await postAddProductToCartService(productId, token);

      } else if (type === "decrement") {
        response = await deleteProductFromCartService(productId, token, removeProduct);
      }
      if (response.status === 200 || response.status === 201) {
        if (type === "increment") {
          dispatch({
            type: actionTypes.UPDATE_PRODUCT_QTY_IN_CART,
            payload: state.cart.map((product) =>
            (product.product === productId) || (product._id === productId)
                ? { ...product, qty: product.qty + 1 }
                : product
            ),
          });
        } else if (type === "decrement") {
          dispatch({
            type: actionTypes.UPDATE_PRODUCT_QTY_IN_CART,
            payload: state.cart.map((product) =>
            product.product === productId
                ? { ...product, qty: product.qty - 1 }
                : product
            ),
          });
        }
      }
    } catch (err) {
      console.log(err);

      notify(
        "error",
        err?.response?.data?.errors
          ? err?.response?.data?.errors[0]
          : "Algum Erro Ocorreu!!"
      );
    } finally {
      setDisableCart(false);
    }
  };

  const deleteProductFromCart = async (productId) => {
    setDisableCart(true);
    try {
      const removeProduct = true; // remove o produto da bag
      const response = await deleteProductFromCartService(productId, token, removeProduct);
      const data = await response.json();

      if (response.status === 200 || response.status === 201) {
        if (data.cart.length === 0) {
          // Se o carrinho está vazio após remover o produto, atualiza o estado do carrinho para um array vazio
          dispatch({
            type: actionTypes.DELETE_PRODUCTS_FROM_CART,
            payload: [],
          });
        } else {
          // Caso contrário, atualiza o estado do carrinho com o conteúdo recebido da resposta
          dispatch({
            type: actionTypes.DELETE_PRODUCTS_FROM_CART,
            payload: data.cart,
          });
        }
        updateInCartOrInWish(productId, "inCart", false);
        notify("info", "Produto Removido da Bag");
      }
    } catch (err) {
      console.log(err);
      notify(
        "error",
        err?.response?.data?.errors
          ? err?.response?.data?.errors[0]
          : "Algum Erro Ocorreu!!"
      );
    } finally {
      setDisableCart(false);
    }
  };

  const clearCart = () => {
    state.cart.map(async ({ _id }) => {
      try {
        const response = await clearCartService(token);
        if (response.status === 200 || response.status === 201) {
        }
        dispatch({
          type: actionTypes.DELETE_PRODUCTS_FROM_CART,
          payload: [],
        });
      } catch (err) {
        console.log(err);
        notify(
          "error",
          err?.response?.data?.errors
            ? err?.response?.data?.errors[0]
            : "Algum Erro Ocorreu!!"
        );
      }
    });
    updateInCartOrInWish();
  };

  const { totalPriceOfCartProducts, actualPriceOfCart } = state.cart.reduce(
    (acc, { qty, price, newPrice }) => ({
      totalPriceOfCartProducts: acc.totalPriceOfCartProducts + qty * newPrice,
      actualPriceOfCart: acc.actualPriceOfCart + qty * price,
    }),
    { totalPriceOfCartProducts: 0, actualPriceOfCart: 0 }
  );

  const isInCart = (productId) => {
    const cartItem = state.cart.find((item) => item._id === productId && item.inCart);
    if (cartItem) {
      return true;
    } else {
      const productItem = state.cart.find((item) => item.product === productId && item.inCart);
      return !!productItem; // Converte o resultado em booleano usando o operador de negação dupla !!
    }
  };
    
  
  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        disableCart,
        loadingCart,
        isInCart,
        addProductToCart,
        updateProductQtyInCart,
        deleteProductFromCart,
        totalPriceOfCartProducts,
        actualPriceOfCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
