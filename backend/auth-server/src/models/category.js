const mongoose = require("mongoose");
const { connectCategory } = require("../utils/connectdbCategory");
const Schema = mongoose.Schema;

// Esquema de dados de categorias de produto (Category)
const CategorySchema = new Schema({
  _id: {
    type: String,
    metadata: {
      type: String,
      description: "ID da categoria de produto.",
    },
  },
  categoryName: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Nome da categoria de produto.",
    },
  },
  description: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Descrição da categoria de produto.",
    },
  },
  categoryImage: {
    type: String,
    default: "",
    metadata: {
      type: String,
      description: "Nome ou caminho da imagem associada à categoria de produto.",
    },
  },
});

const CategoryModel = connectCategory.model("Category", CategorySchema);

module.exports = CategoryModel;
