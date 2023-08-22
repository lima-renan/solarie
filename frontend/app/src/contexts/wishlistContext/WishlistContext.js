import { createContext, useEffect, useReducer, useState } from "react";
import { initialState, wishlistReducer } from "../../reducers/wishlistReducer";
import {
  deleteProductFromWishlistService,
  getWishlistItemsService,
  postAddProductToWishlistService,
} from "../../api/apiServices";
import { actionTypes } from "../../utils/actionTypes";
import { useAuthContext, useProductsContext } from "..";
import { notify } from "../../utils/utils";

export const WishlistContext = createContext();

const WishlistContextProvider = ({ children }) => {
  const { token } = useAuthContext();
  const { updateInCartOrInWish } = useProductsContext();
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [disableWish, setDisableWish] = useState(false);
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  useEffect(() => {
    if (token) {
      setLoadingWishlist(true);
      (async () => {
        try {
          const wishlistRes = await getWishlistItemsService(token);
          const data = await wishlistRes.json();

          if (wishlistRes.status === 200) {
            dispatch({
              type: actionTypes.INITIALIZE_WISHLIST,
              payload: data.wishlist,
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
          setLoadingWishlist(false);
        }
      })();
    }
  }, [token]);

  const addProductToWishlist = async (product) => {
    setDisableWish(true);
    try {
      const response = await postAddProductToWishlistService(product.product? product.product: product._id, token);

      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.ADD_PRODUCT_TO_WISHLIST,
          payload: [{ ...product, inWish: true }, ...state.wishlist],
        });
        updateInCartOrInWish(product.product? product.product: product._id, "inWish", true);
      }
      notify("success", "Adicionado aos favoritos");
    } catch (err) {
      console.log(err);
      notify(
        "error",
        err?.response?.data?.errors
          ? err?.response?.data?.errors[0]
          : "Algum erro ocorreu!!"
      );
    } finally {
      setDisableWish(false);
    }
  };

  const deleteProductFromWishlist = async (productId) => {
    setDisableWish(true);
    try {
      const response = await deleteProductFromWishlistService(productId, token);
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.DELETE_PRODUCTS_FROM_WISHLIST,
          payload: state.wishlist.filter(({ product, _id }) => (product ? product : _id) !== productId),
        });
        updateInCartOrInWish(productId, "inWish", false);
        notify("warn", "Removido da lista");
      }
    } catch (err) {
      console.log(err);
      notify(
        "error",
        err?.response?.data?.errors
          ? err?.response?.data?.errors[0]
          : "Algum erro ocorreu!!"
      );
    } finally {
      setDisableWish(false);
    }
  };

  const isInWish = (productId) => {  
    const wishItem = state.wishlist.find((item) => item._id === productId && item.inWish);
    if (wishItem) {
      return true;
    } else {
      const productItem = state.wishlist.find((item) => (item.product === productId && item.inWish));
      return !!productItem; // Converte o resultado em booleano usando o operador de negação dupla !!
    }
  };


  return (
    <WishlistContext.Provider
      value={{
        wishlist: state.wishlist,
        disableWish,
        loadingWishlist,
        addProductToWishlist,
        deleteProductFromWishlist,
        isInWish,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContextProvider;
