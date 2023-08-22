const faker = require('faker');
const Product = require('../models/product'); // Importar o modelo de produtos
const User = require('../models/user');       // Importar o modelo de usuários
const Wishlist = require('../models/wishlist'); // Importar o modelo de wishlist
const { generateMinioImageUrl } = require("../utils/connectMinio");


// Função para criar uma wishlist com produtos aleatórios
async function createRandomWishlist(userId, products) {
  const wishlistProducts = [];

  for (let i = 0; i < 10; i++) {
    const randomProduct = faker.random.arrayElement(products);
    imageUrl = await generateMinioImageUrl('products', (randomProduct.category + '/' + randomProduct.image))
    wishlistProducts.push({
      imageUrl,
      rating: randomProduct.rating,
      price: randomProduct.price,
      newPrice: randomProduct.newPrice,
      product: randomProduct._id,
      quantity: randomProduct.quantity,
      name: randomProduct.name,
      category: randomProduct.category,
      image: randomProduct.image,
      brand: randomProduct.brand,
      gender: randomProduct.gender,
        
    });
  }

  const wishlistData = {
    user: userId,
    products: wishlistProducts,
  };

  await Wishlist.create(wishlistData);
}

exports.generateWishlists = async () => {
  try {
    const products = await Product.find().limit(29); // Supondo que você tenha 29 produtos
    const users = await User.find().limit(1000);     // Obtém os primeiros 1000 usuários
  
    const userIdsInWishlists = {}; // Usar um mapa para armazenar userIds já utilizados
  
    for (const user of users) {
      if (!userIdsInWishlists[user._id]) { // Verificar se userId já foi utilizado
        await createRandomWishlist(user._id, products);
        userIdsInWishlists[user._id] = true; // Marcar userId como utilizado
      }
    }
  } catch (error) {
    console.error("Erro ao gerar wishlists:", error);
  }
};