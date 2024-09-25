const Minio = require('minio');

// Configurações do MinIO
const minioClient = new Minio.Client({
  endPoint: '172.21.0.9', // Endereço do servidor MinIO
  port: 9000, // Porta do servidor MinIO
  useSSL: false, // Se o servidor usa SSL
  accessKey: 'minio_user', // Sua chave de acesso do MinIO
  secretKey: 'minio_password', // Sua chave secreta do MinIO
});

// Função para gerar a URL da imagem no MinIO
async function generateMinioImageUrl(bucketName, imageName) {
    // Defina a duração de validade da URL em segundos (por exemplo, 1 hora)
    const expiration = 3600;
  
    try {
      // Gere a URL assinada para a imagem
      const url = await minioClient.presignedGetObject(bucketName, imageName, expiration);
      return url;
    } catch (err) {
      console.error('Erro ao gerar a URL da imagem:', err);
      return null;
    }
  }


module.exports = {
    minioClient,
    generateMinioImageUrl,
  };