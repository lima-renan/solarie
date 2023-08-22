// cria rotas para signin, login e logout

const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const User = require("../models/user");
const Wishlist = require("../models/wishlist");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { formatDate } = require("../utils/addDate");
const { getByIdFromMongoDB, getInWishByProductId } = require("../utils/getDocsMongoDB");
const { updateAllProductImageUrls } = require("../utils/addUrlImages");
const mongoose = require("mongoose");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");


router.post("/signup", (req, res, next) => {
  // Verify that first name is not empty
  if (!req.body.firstName) {
    res.statusCode = 500;
    res.send({
      name: "FirstNameError",
      message: "The first name is required",
    });
  } else {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          console.log(err)
          res.statusCode = 500;
          res.send(err);
        } else {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName || "";
          user.gender = req.body.gender;
          user.dayBday = req.body.dayBday;
          user.monthBday = req.body.monthBday;
          user.yearBday = req.body.yearBday;
          user.email = req.body.email;
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          user.refreshToken.push({ refreshToken });
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.send(err);
            } else {
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
              res.json({ success: true, token, refreshToken, createdAt:(user._id).getTimestamp()});
            }
          });
        }
      }
    );
  }
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  
  const token = getToken({ _id: req.user._id });
  const refreshToken = getRefreshToken({ _id: req.user._id });
  User.findById(req.user._id).then(
    (user) => {
      user.refreshToken.push({ refreshToken });
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
          res.json({success: true, refreshToken, token, firstName: user.firstName, lastName: user.lastName, updateAt:(user._id).getTimestamp()});
        }
      }); 
    },
    (err) => next(err)
  );
});

router.post("/refreshToken", (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer ")) {
    const refreshToken = authorization.split(" ")[1];

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userId = payload._id;
      User.findOne({ _id: userId }).then(
        (user) => {
          if (user) {
            // Find the refresh token against the user record in database
            const tokenIndex = user.refreshToken.findIndex(
              (item) => item.refreshToken === refreshToken
            );

            if (tokenIndex === -1) {
              res.statusCode = 401;
              res.send("Unauthorized");
            } else {
              const token = getToken({ _id: userId });
              // If the refresh token exists, then create new one and replace it.
              const newRefreshToken = getRefreshToken({ _id: userId });
              user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
              user.save((err, user) => {
                if (err) {
                  res.statusCode = 500;
                  res.send(err);
                } else {
                  res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
                  res.send({ success: true, token });
                }
              });
            }
          } else {
            res.statusCode = 401;
            res.send("Unauthorized");
          }
        },
        (err) => next(err)
      );
    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
});

// rota para adicionar um produto ao carrinho de compras (cart)
router.post("/cart", verifyUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    // Verifica se o userId é um ObjectId válido antes de fazer a consulta
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "O ID do usuário é inválido." });
    }

    // Converte a string userId em um ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Usa o método lean() para retornar documentos como objetos JavaScript puros
    const user = await User.findById(userObjectId).lean().exec();

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Encontra o carrinho do usuário
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Se o carrinho não existir, cria um novo
      cart = new Cart({ user: userId });
    }

    // Verifica se o produto já está no carrinho
    const existingProduct = cart.products.find((item) => item.product.toString() === productId);

    if (existingProduct) {
      // Se o produto já existe no carrinho, incrementa a quantidade e atualiza o campo updatedAt
      if(existingProduct.qty < existingProduct.quantity){
        existingProduct.qty += 1;
        const inWishlist = await getInWishByProductId(productId); // Verifica se o produto está na lista de desejo
        if(inWishlist){
          existingProduct.inWish = inWishlist;
        }
        else{
          existingProduct.inWish = false;
        }
      }
      else{
        return res.status(404).json({ message: "Sem estoque." });
      }
      existingProduct.updatedAt = formatDate();
    } else {
      const product = await getByIdFromMongoDB('product',productId);
      const inWishlist = await getInWishByProductId(productId);
      // Caso contrário, cria um novo objeto para o produto com quantidade igual a 1 e atualiza o campo updatedAt
      cart.products.push({
        product: productId,
        qty: 1,
        quantity: product.quantity,
        inWish: inWishlist? inWishlist : false,
        brand: product.brand,
        name: product.name,
        category: product.category,
        image: product.image,
        rating: product.rating,
        price: product.price,
        newPrice: product.newPrice,
      });
    }

    // Atualize as URLs das imagens dos produtos no carrinho
    const cartWithUpdatedUrls = await updateAllProductImageUrls(cart);

    // Atualiza a data de atualização do carrinho
    cartWithUpdatedUrls.updatedAt = formatDate();

    // Salva as alterações no banco de dados
    await cartWithUpdatedUrls.save();

    return res.status(201).json({ cart: cartWithUpdatedUrls.products });
  } catch (err) {
    next(err);
  }
});


// rota para adicionar um produto a lista de desejos (wishlist)
router.post("/wishlist", verifyUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    
    // Verifica se o userId é um ObjectId válido antes de fazer a consulta
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "O ID do usuário é inválido." });
    }

    // Converte a string userId em um ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Usa o método lean() para retornar documentos como objetos JavaScript puros
    const user = await User.findById(userObjectId).lean().exec();

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Encontra a lista de desejos do usuário
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // Se a lista de desejos não existir, cria uma nova
      wishlist = new Wishlist({ user: userId });
    }

    // Verifica se o produto já está na lista de desejos
    const existingProduct = wishlist.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingProduct) {
      return res.status(400).json({ message: "O produto já está na lista de desejos." });
    }

    // Adiciona o produto à lista de desejos do usuário com quantidade 1 e a data de atualização
    const product = await getByIdFromMongoDB('product',productId);
      // Caso contrário, cria um novo objeto para o produto com quantidade igual a 1 e atualiza o campo updatedAt
      wishlist.products.push({
        product: productId,
        quantity: product.quantity,
        name: product.name,
        category: product.category,
        image: product.image,
        rating: product.rating,
        brand: product.brand,
        gender: product.gender,
        price: product.price,
        newPrice: product.newPrice,
      });

    // Atualize as URLs das imagens dos produtos na lista de desejos
    const wishlistWithUpdatedUrls = await updateAllProductImageUrls(wishlist);

    // Atualize a data de atualização da lista de desejos
    wishlistWithUpdatedUrls.updatedAt = formatDate();

    // Salve as alterações no banco de dados
    await wishlistWithUpdatedUrls.save();

    return res.status(201).json({ wishlist: wishlistWithUpdatedUrls.products });
  } catch (err) {
    next(err);
  }
});

router.get("/me", verifyUser, (req, res, next) => {
  res.send(req.user);
});

router.get("/logout", verifyUser, (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  User.findById(req.user._id).then(
    (user) => {
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken
      );

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          res.clearCookie("refreshToken", COOKIE_OPTIONS);
          res.send({ success: true });
        }
      });
    },
    (err) => next(err)
  );
});

// rota para receber os produtos do carrinho de compras (cart)
router.get("/cart", verifyUser, async (req, res, next) => {

  try {
    const userId = req.user._id;
    // Verifica se o userId é um ObjectId válido antes de fazer a consulta
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "O ID do usuário é inválido." });
    }

    // Converte a string userId em um ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Usa o método lean() para retornar documentos como objetos JavaScript puros
    const user = await User.findById(userObjectId).lean().exec();


    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Encontra o carrinho do usuário
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({ cart: [] }); // Se o carrinho não existir, retorne um array vazio
    }

    // Atualize as URLs das imagens dos produtos no carrinho
    const cartWithUpdatedUrls = await updateAllProductImageUrls(cart);

    // Atualiza a data de atualização do carrinho
    cartWithUpdatedUrls.updatedAt = formatDate();

    // Salva as alterações no banco de dados
    await cartWithUpdatedUrls.save();

    // Retorna o conteúdo do carrinho
    return res.status(200).json({ cart: cartWithUpdatedUrls.products });

  } catch (err) {
    next(err);
  }
});

// rota para receber os produtos a lista de desejos (wishlist)
router.get("/wishlist",  verifyUser, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Verifica se o userId é um ObjectId válido antes de fazer a consulta
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "O ID do usuário é inválido." });
    }

    // Converte a string userId em um ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Usa o método lean() para retornar documentos como objetos JavaScript puros
    const user = await User.findById(userObjectId).lean().exec();

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Encontra a lista de desejos do usuário
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({ wishlist: [] }); // Se a lista de desejos não existir, retorna um array vazio
    }

    // Atualize as URLs das imagens dos produtos na lista de desejos
    const wishlistWithUpdatedUrls = await updateAllProductImageUrls(wishlist);

    // Atualiza a data de atualização na lista de desejos
    wishlistWithUpdatedUrls.updatedAt = formatDate();

    // Salva as alterações no banco de dados
    await wishlistWithUpdatedUrls.save();

    // Retorna o conteúdo  na lista de desejos
    return res.status(200).json({ wishlist: wishlistWithUpdatedUrls.products });

  } catch (err) {
    next(err);
  }
});

// Deleta um item do carrinho
router.delete("/cart", verifyUser, async (req, res, next) => {

  try {
    const userId = req.user._id;
    
    const { productId, removeProduct } = req.body;

    // Verifica se o userId é um ObjectId válido antes de fazer a consulta
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "O ID do usuário é inválido." });
    }

    // Converte a string userId em um ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Usa o método lean() para retornar documentos como objetos JavaScript puros
    const user = await User.findById(userObjectId).lean().exec();

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Encontra o carrinho do usuário
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Bag não encontrado." });
    }

    // Verifica se o produto já está no carrinho
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Produto não encontrado no carrinho." });
    }

    // Se for solicitado para remover o produto da bag
    if(removeProduct){
      cart.products.pull(cart.products[existingProductIndex]._id);
    }
    else if (cart.products[existingProductIndex].qty > 1) { // Se a quantidade for maior que 1, reduza a quantidade do produto
      cart.products[existingProductIndex].qty -= 1;
    } 
    else {
      // Se a quantidade for 1, remova o produto do carrinho
      cart.products.splice(existingProductIndex, 1);
    }

    // Atualize as URLs das imagens dos produtos no carrinho
    const cartWithUpdatedUrls = await updateAllProductImageUrls(cart);

    // Atualiza a data de atualização do carrinho
    cartWithUpdatedUrls.updatedAt = formatDate();

    // Salva as alterações no banco de dados
    await cartWithUpdatedUrls.save();

    // Retorna o conteúdo do carrinho
    res.status(200).json({ cart: cartWithUpdatedUrls.products });

  } catch (err) {
    next(err);
  }
});

// Remove um produto específico da lista de desejos pelo productId
router.delete("/wishlist",verifyUser, async (req, res, next) => {

  try {
    const userId = req.user._id;
    
    const { productId } = req.body;
    // Verifica se o userId é um ObjectId válido antes de fazer a consulta
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "O ID do usuário é inválido." });
    }

    // Converte a string userId em um ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Usa o método lean() para retornar documentos como objetos JavaScript puros
    const user = await User.findById(userObjectId).lean().exec();

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Encontra a lista de desejos do usuário
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Lista de desejos não encontrada." });
    }

    // Verifica se o produto já está na lista de desejos
    const existingProductIndex = wishlist.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Produto não encontrado na lista de desejos." });
    }
    
    // Remove o produto da Wishlist usando a função pull() no array de produtos
    let cart = await Cart.findOne({ user: userId }); // avalia se o produto está na bag
    if(cart){
      const existingProductCartIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if(existingProductCartIndex !== -1){
        existingProductCartIndex.inWish = false; //se o produto tiver no carrinho, ele é tirado da lista
      }
    }
    wishlist.products.pull(wishlist.products[existingProductIndex]._id);


    // Atualize as URLs das imagens dos produtos na lista de desejos
    const wishlistWithUpdatedUrls = await updateAllProductImageUrls(wishlist);

    // Atualize a data de atualização da lista de desejos
    wishlistWithUpdatedUrls.updatedAt = formatDate();
 
    // Salve as alterações no banco de dados
    await wishlistWithUpdatedUrls.save();
 
    return res.status(200).json({ wishlist: wishlistWithUpdatedUrls.products });

  } catch (err) {
    next(err);
  }
});


// Limpa todo o carrinho
router.delete("/cart/clear", verifyUser, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Verifica se o userId é um ObjectId válido antes de fazer a consulta
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "O ID do usuário é inválido." });
    }

    // Converte a string userId em um ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Usa o método lean() para retornar documentos como objetos JavaScript puros
    const user = await User.findById(userObjectId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Limpa todo o carrinho do usuário
    const cart = await Cart.findOneAndUpdate({ user: userId }, { products: [] });

    if (!cart) {
      return res.status(404).json({ message: "Bag não encontrada." });
    }

    // Atualiza a data de atualização do carrinho
    cart.updatedAt = formatDate();

    // Salva as alterações no banco de dados
    await cart.save();

    return res.status(200).json({ success: true});
  } catch (err) {
    next(err);
  }
});

// Rota para limpar toda a lista de desejos do usuário
router.delete("/wishlist/clear", async (req, res, next) => {
  try {
    
    const { userId } = req.body;

    // Verifica se o userId é um ObjectId válido antes de fazer a consulta
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "O ID do usuário é inválido." });
    }

    // Converte a string userId em um ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);

    // Usa o método lean() para retornar documentos como objetos JavaScript puros
    const user = await User.findById(userObjectId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Limpe toda a lista de desejos do usuário
    const wishlist = await Wishlist.findOneAndUpdate({ user: userId }, { products: [] });

    if (!wishlist) {
      return res.status(404).json({ message: "Lista de desejos não encontrada." });
    }

    // Atualize a data de atualização da lista de desejos
    wishlist.updatedAt = formatDate();

    // Salve as alterações no banco de dados
    await wishlist.save();

    return res.status(200).json({ wishlist: [] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
