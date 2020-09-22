module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://devoatnaja:wq65z5CjqDxqOdD5@cluster0.yqxra.gcp.mongodb.net/vuenuxt01?retryWrites=true&w=majority',
  JWT_SERCRET: process.env.JWT_SERCRET || 'secret1'
}