const mongoose = require("mongoose");
const url_product = process.env.MONGO_DB_PRODUCT_CONNECTION_STRING;
const connectProduct = mongoose.createConnection(url_product, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports = { connectProduct };