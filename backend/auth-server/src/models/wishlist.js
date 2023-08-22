const mongoose = require("mongoose");
const { connectWishlist } = require("../utils/connectdbWishlist");
const { formatDate } = require("../utils/addDate");
const Product = require('./product');
const User = require('./user');
const Schema = mongoose.Schema;

// Subesquema para produtos na lista de desejos
const ProductInWishlistSchema = new Schema({
  product: {
    type: Schema.Types.Mixed,
    ref: "Product",
    metadata: {
      type: String,
      description: "Produto presente na lista de desejos. Pode ser tanto um ObjectId quanto uma String (UUID).",
    },
  },
  quantity: {
    type: Number,
    ref: "Product",
    metadata: {
      type: String,
      description: "Quantidade total disponível do produto na lista de desejos, referenciando o modelo 'Product'.",
    },
  },
  inWish: {
    type: Boolean,
    default: true,
    metadata: {
      type: String,
      description: "Indica se o produto está atualmente na lista de desejos (true) ou não (false).",
    },
  },
  brand: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "Marca do produto na lista de desejos, referenciando o modelo 'Product'.",
    },
  },
  gender: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "Gênero do produto na lista de desejos, referenciando o modelo 'Product'.",
    },
  },
  name: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "Nome do produto na lista de desejos, referenciando o modelo 'Product'.",
    },
  },
  category: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "Categoria do produto na lista de desejos, referenciando o modelo 'Product'.",
    },
  },
  image: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "Nome da imagem associada ao produto na lista de desejos, referenciando o modelo 'Product'.",
    },
  },
  imageUrl: {
    type: String,
    default: "",
    metadata: {
      description: "URL da imagem do produto na lista de desejos, valor padrão vazio caso não seja especificado.",
    },
  },
  rating: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "Classificação do produto na lista de desejos, valor padrão 0 se não houver classificação.",
    },
  },
  price: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "Preço do produto na lista de desejos, valor padrão 0 se não houver preço especificado.",
    },
  },
  newPrice: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "Novo preço do produto na lista de desejos, valor padrão 0 se não houver preço novo especificado.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    metadata: {
      type: String,
      description: "Data de criação do produto na lista de desejos. Valor padrão é a data atual.",
    },
  },
  updatedAt: {
    type: String,
    default: formatDate(),
    metadata: {
      type: String,
      description: "Data de atualização do produto na lista de desejos. Valor padrão é a data atual formatada.",
    },
  },
});

// Esquema de dados de wishlist (Wishlist)
const WishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    metadata: {
      type: String,
      description: "ID do usuário associado à lista de desejos (wishlist).",
    },
  },
  products: {
    type: [ProductInWishlistSchema],
    metadata: {
      type: String,
      description: "Lista de produtos presentes na lista de desejos.",
    },
  },
  updatedAt: {
    type: String,
    default: formatDate(),
    metadata: {
      type: String,
      description: "Data de atualização da lista de desejos. Valor padrão é a data atual formatada.",
    },
  },
});

module.exports = connectWishlist.model("Wishlist", WishlistSchema);