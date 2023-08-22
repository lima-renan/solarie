const { generateMinioImageUrl } = require("./connectMinio");

// Função para adicionar a URL da imagem ao produto
async function updateProductImageUrls(tyName, item) {
    try {
      let imageUrl;
      if (tyName === 'product') {
        imageUrl = await generateMinioImageUrl('products', (item.category + '/' + item.image));
      } else if (tyName === 'category') {
        imageUrl = await generateMinioImageUrl('categories', item.categoryImg);
      }
      if (imageUrl) {
        return { ...item, imageUrl };
      } else {
        return item;
      }
    } catch (err) {
      console.error('Erro ao adicionar a URL da imagem ao produto:', err);
      return item;
    }
  }

// Função para atualizar as URLs das imagens dos produtos em cart ou wishlist
async function updateAllProductImageUrls(cartOrWishlist) {
  try {
   
    const updatedProducts = await Promise.all(
      cartOrWishlist.products.map(async (item) => {
        const product = item;
        if (product) {
          const imageUrl = await generateMinioImageUrl('products', (product.category + '/' + product.image));
          if (imageUrl) {
            product.imageUrl = imageUrl;
          }
        }
        return item;
      })
    );
    cartOrWishlist.products = updatedProducts;
    return cartOrWishlist;
  } catch (err) {
    console.error('Erro ao atualizar as URLs das imagens:', err);
    return cartOrWishlist;
  }
}

  module.exports = { 
    updateProductImageUrls,
    updateAllProductImageUrls
 }  