import React from "react";
import SingleProduct from "../components/products/SingleProduct";
import { useWishlistContext } from "../contexts";
import emptyWish from "../assets/empty-wish.gif";

const Wishlist = () => {
  const { wishlist } = useWishlistContext();

  return (
    <div>
      {wishlist.length ? (
        <>
          {" "}
          <h1 className="text-2xl py-6 font-semibold text-gray-800">
            Favoritos
          </h1>
          <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((glass) => (
              <SingleProduct key={glass.product? glass.product : glass._id} product={glass} fromWish={true} />
            ))}
          </main>
        </>
      ) : (
        <div className="h-[65vh] w-full flex flex-col items-center justify-center pt-3">
          <img
            src={emptyWish}
            alt="empty-wishlist"
            className="w-full xs:w-1/2 sm:w-1/3"
          />
          <span className="font-sans text-xl  font-bold uppercase  tracking-wide text-gray-300">
            Nada por aqui ainda!
          </span>
          <p className="text-gray-400">
            Adicione seus favoritos
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
