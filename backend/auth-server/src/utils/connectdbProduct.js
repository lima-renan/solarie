// conecta-se com o mongodb para salvar os dados de auteenticação

const mongoose = require("mongoose");
const url_product = process.env.MONGO_DB_PRODUCT_CONNECTION_STRING;
const connectProduct = mongoose.createConnection(url_product, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connectProduct
  .then((dbProduct) => {
    console.log("connected to db product");
  })
  .catch((err) => {
    console.log(err);
  });
  
module.exports = { connectProduct }
