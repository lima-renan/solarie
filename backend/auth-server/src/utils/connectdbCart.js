// conecta-se com o mongodb para salvar os dados de auteenticação

const mongoose = require("mongoose");
const url_cart = process.env.MONGO_DB_CART_CONNECTION_STRING;
const connectCart = mongoose.createConnection(url_cart, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connectCart
  .then((dbCart) => {
    console.log("connected to db cart");
  })
  .catch((err) => {
    console.log(err);
  });

  module.exports = { connectCart }