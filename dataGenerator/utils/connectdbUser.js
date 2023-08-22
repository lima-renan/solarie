// conecta-se com o mongodb para salvar os dados de auteenticação

const mongoose = require("mongoose");
const url_user = process.env.MONGO_DB_USER_CONNECTION_STRING;
const connectUser= mongoose.createConnection(url_user, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports = { connectUser}
