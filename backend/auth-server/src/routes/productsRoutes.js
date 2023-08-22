// cria rotas para signin, login e logout

const express = require("express");
const router = express.Router();
const { updateProductImageUrls } = require("../utils/addUrlImages");
const { getAllDocsFromMongoDB, getByIdFromMongoDB } = require("../utils/getDocsMongoDB");


// Rota para buscar todos os produtos
router.get('/', async (req, res) => {
  try {
      const productsMongo = await getAllDocsFromMongoDB('product');
      const products = await Promise.all(productsMongo.map((product) => updateProductImageUrls('product', product)));
      res.json({products});
  } catch (err) {
    console.error('Erro ao buscar os produtos com as URLs de imagens:', err);
    res.status(500).json({ error: 'Erro ao buscar os produtos!' });
  }
});


// Rota para buscar busca um único produto pelo ID
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
   
   const product = await getByIdFromMongoDB('product',productId);
   if (product) {
     const productWithUrl = await updateProductImageUrls('product',product);
     res.json({product: productWithUrl});
   } else {
     res.status(404).json({ error: 'Produto não encontrado' });
   }
  } catch (error) {
    console.error('Erro ao buscar o produto no MongoDB:', error);
    res.status(500).json({ error: 'Erro ao buscar o produto' });
  }
});


module.exports = router;
