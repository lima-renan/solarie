const mongoose = require("mongoose");
const { connectUser } = require("../utils/connectdbUser");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

// Esquema de dados de usuário (User)
const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Token de atualização de sessão do usuário.",
    },
  },
});

const UserSchema = new Schema({
  firstName: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Primeiro nome do usuário.",
    },
  },
  lastName: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Sobrenome do usuário.",
    },
  },
  gender: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Gênero do usuário.",
    },
  },
  dayBday: {
    type: Number,
    default: "",
    metadata: {
      type: String,
      description: "Dia de aniversário do usuário.",
    },
  },
  monthBday: {
    type: Number,
    default: "",
    metadata: {
      type: String,
      description: "Mês de aniversário do usuário.",
    },
  },
  yearBday: {
    type: Number,
    default: "",
    metadata: {
      type: String,
      description: "Ano de aniversário do usuário.",
    },
  },
  email: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Endereço de e-mail do usuário.",
    },
  },
  authStrategy: {
    type: String,
    default: "local",
    metadata: {
      type: String,
      description: "Estratégia de autenticação do usuário.",
    },
  },
  username: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Usuário do cliente.",
    },
  },
  refreshToken: {
    type: [Session],
    metadata: {
      type: String,
      description: "Token(s) de atualização de sessão do usuário.",
    },
  },
},
{ 
  timestamps: {},
});

// Remove refreshToken from the response
UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.refreshToken;
    return ret;
  },
});

module.exports = connectUser.model("User", UserSchema);