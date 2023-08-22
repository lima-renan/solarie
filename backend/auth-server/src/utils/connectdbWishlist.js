// conecta-se com o mongodb para salvar os dados de auteenticação

const mongoose = require("mongoose");
const url_wishlist = process.env.MONGO_DB_WISHLIST_CONNECTION_STRING;
const connectWishlist = mongoose.createConnection(url_wishlist, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connectWishlist
  .then((dbWishlist) => {
    console.log("connected to db wishlist");
  })
  .catch((err) => {
    console.log(err);
  });

  module.exports = { connectWishlist }