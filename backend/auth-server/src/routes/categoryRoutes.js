// cria rotas para signin, login e logout

const express = require("express");
const router = express.Router();
const { updateProductImageUrls } = require("../utils/addUrlImages");
const { getAllDocsFromMongoDB, getByIdFromMongoDB } = require("../utils/getDocsMongoDB");


// Rota para buscar todos os produtos
router.get('/', async (req, res) => {

  try {
      const categoriesMongo = await getAllDocsFromMongoDB('category');
      const categories = await Promise.all(categoriesMongo.map((category) => updateProductImageUrls('category', category)));
      res.json({categories});
  } catch (err) {
    console.error('Erro ao buscar as categorias com as URLs de imagens:', err);
    res.status(500).json({ error: 'Erro ao buscar as categorias!' });
  }
});


// Rota para buscar busca um único produto pelo ID
router.get('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
   
   const category = await getByIdFromMongoDB('category',categoryId);
   if (category) {
     const categoryWithUrl = await updateProductImageUrls('category',category);
     res.json({category: categoryWithUrl});
   } else {
     res.status(404).json({ error: 'Categoria não encontrada' });
   }
  } catch (error) {
    console.error('Erro ao buscar a categoria no MongoDB:', error);
    res.status(500).json({ error: 'Erro ao buscar a categoria' });
  }
});


module.exports = router;
