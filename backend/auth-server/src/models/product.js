const mongoose = require("mongoose");
const { connectProduct } = require("../utils/connectdbProduct");
const Schema = mongoose.Schema;

// Esquema de dados de produto (Product)
const ProductSchema = new Schema({
  _id: {
    type: String,
    metadata: {
      type: String,
      description: "ID do produto.",
    },
  },
  name: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Nome do produto.",
    },
  },
  description: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Descrição do produto.",
    },
  },
  brand: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Marca do produto.",
    },
  },
  category: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Categoria do produto.",
    },
  },
  gender: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Gênero do produto.",
    },
  },
  weight: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Peso do produto.",
    },
  },
  quantity: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "Quantidade total disponível do produto.",
    },
  },
  image: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Nome ou caminho da imagem associada ao produto.",
    },
  },
  rating: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "Classificação do produto.",
    },
  },
  price: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "Preço do produto.",
    },
  },
  newPrice: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "Novo preço do produto.",
    },
  },
  trending: {
    type: Boolean,
    default: false,
    metadata: {
      type: String,
      description: "Indica se o produto está em tendência ou não.",
    },
  },
});

module.exports = connectProduct.model("Product", ProductSchema);
