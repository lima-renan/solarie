// conecta-se com o mongodb para salvar os dados de auteenticação

const mongoose = require("mongoose");
const url_category = process.env.MONGO_DB_CATEGORY_CONNECTION_STRING;
const connectCategory = mongoose.createConnection(url_category, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connectCategory
  .then((dbUser) => {
    console.log("connected to db category");
  })
  .catch((err) => {
    console.log(err);
  });
  
module.exports = { connectCategory }
