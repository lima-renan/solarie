const Product = require('../models/product');
const Category = require('../models/category');
const Wishlist = require('../models/wishlist');

async function getAllDocsFromMongoDB(type_name) {
  if(type_name === 'product'){
    try {
      const products = await Product.find().lean().exec();
      return products;
    } catch (err) {
      console.error('Erro ao buscar os produtos no MongoDB:', err);
      return [];
    }
  }
  else if (type_name === 'category'){
    try {
      const categories = await Category.find().lean().exec();
      return categories;
    } catch (err) {
      console.error('Erro ao buscar as categorias no MongoDB:', err);
      return [];
    }
  }
}

  // Função para buscar um único produto no MongoDB pelo ID
  async function getByIdFromMongoDB(type_name,id) {
    if(type_name === 'product'){
      try {
        const product = await Product.findById(id).lean().exec();
        return product;
      } catch (err) {
        console.error('Erro ao buscar o produto no MongoDB:', err);
        return null;
      }
    }
    else if (type_name === 'category'){
      try {
        const category = await Category.findById(id).lean().exec();
        return category;
      } catch (err) {
        console.error('Erro ao buscar o produto no MongoDB:', err);
        return null;
      }
    }

  }

  // Função para buscar o inWish de um produto específico na Wishlist
async function getInWishByProductId(productId) {
  try {
    // Buscar o registro da Wishlist que contenha o productId específico na lista de products
    const wishlistItem = await Wishlist.findOne({ "products.product": productId }).exec();

    // Verificar se o item foi encontrado
    if (wishlistItem) {
      return true;
    }

    // Se o produto não foi encontrado na Wishlist ou a Wishlist em si não foi encontrada, retornar false (não está na wishlist)
    return false;
  } catch (err) {
    console.error("Erro ao buscar inWish do produto:", err);
    return false;
  }
}

  module.exports = { 
    getAllDocsFromMongoDB,
    getByIdFromMongoDB,
    getInWishByProductId
 }  