const mongoose = require("mongoose");
const { connectCart } = require("../utils/connectdbCart");
const { formatDate } = require("../utils/addDate");
const Product = require('./product');
const User = require('./user');
const Wishlist = require('./wishlist');
const Schema = mongoose.Schema;

// Esquema para representar cada campo do esquema com suas descrições
const cartItemSchema = {
  product: {
    type: Schema.Types.Mixed,
    ref: "Product",
    metadata: {
      type: String,
      description: "ID do produto presente no carrinho.",
    },
  },
  qty: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "Quantidade do produto presente no carrinho.",
    },
  },
  quantity: {
    type: Number,
    ref: "Product",
    metadata: {
      type: String,
      description: "Quantidade total disponível do produto, referenciando o modelo 'Product'.",
    },
  },
  inCart: {
    type: Boolean,
    default: true,
    metadata: {
      type: String,
      description: "Indica se o produto está atualmente no carrinho (true) ou não (false).",
    },
  },
  inWish: {
    type: Boolean,
    ref: "Wishlist",
    metadata: {
      type: String,
      description: "Indica se o produto está também na lista de desejos (Wishlist) do usuário, referenciando o modelo 'Wishlist'.",
    },
  },
  brand: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "A marca do produto no carrinho, referenciando o modelo 'Product'.",
    },
  },
  name: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "O nome do produto no carrinho, referenciando o modelo 'Product'.",
    },
  },
  category: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "A categoria do produto no carrinho, referenciando o modelo 'Product'.",
    },
  },
  image: {
    type: String,
    ref: "Product",
    metadata: {
      type: String,
      description: "Nome da imagem associada ao produto no carrinho, referenciando o modelo 'Product'.",
    },
  },
  imageUrl: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "URL da imagem do produto no carrinho, valor padrão vazio caso não seja especificado.",
    },
  },
  rating: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "A classificação do produto no carrinho, valor padrão 0 se não houver classificação.",
    },
  },
  price: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "O preço original do produto no carrinho, valor padrão 0 se não houver preço especificado.",
    },
  },
  newPrice: {
    type: Number,
    default: 0,
    metadata: {
      type: String,
      description: "O novo preço do produto no carrinho, valor padrão 0 se não houver preço novo especificado.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    metadata: {
      type: String,
      description: "Data de criação do produto no carrinho. Valor padrão é a data atual.",
    },
  },
  updatedAt: {
    type: String,
    default: formatDate(),
    metadata: {
      type: String,
      description: "Data de atualização do produto no carrinho. Valor padrão é a data atual formatada.",
    },
  },
};

// Esquema para o carrinho de compras (Cart)
const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    metadata: {
      type: String,
      description: "ID do usuário associado ao carrinho de compras.",
    },
  },
  products: {
    type: [cartItemSchema],
    metadata: {
      type: String,
      description: "Lista de produtos presentes no carrinho.",
    },
  },
  updatedAt: {
    type: String,
    default: formatDate(),
    metadata: {
      type: String,
      description: "Data de atualização do carrinho de compras. Valor padrão é a data atual formatada.",
    },
  },
});

const CartModel = connectCart.model("Cart", CartSchema);

module.exports = CartModel;
