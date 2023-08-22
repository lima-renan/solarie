const { generateWishlists } = require("./generators/random-wishlist-generator");

// Importa script para gerar usuários
const { generateMultipleRandomUsers } = require("./generators/random-user-generator");

// Chama a função e insere usuários no MongoDB
generateMultipleRandomUsers()
  .then(() => {
    console.log("Usuários criados com sucesso!");

    // Gera as wishlists após criar os usuários
    generateWishlists()
      .then(() => {
        console.log("Wishlists geradas com sucesso!");
        process.exit(0); // Código 0 para caso de sucesso
      })
      .catch((error) => {
        console.error("Erro ao gerar wishlists", error);
        process.exit(1); // Código 1 para caso de erro nas wishlists
      });
  })
  .catch((error) => {
    console.error("Erro ao gerar usuários", error);
    process.exit(1); // Código 1 para caso de erro nos usuários
  });
