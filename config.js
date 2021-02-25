module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,
  URL: process.env.BASE_URL || 'http://localhost:4000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://devoatnaja:wq65z5CjqDxqOdD5@cluster0.yqxra.gcp.mongodb.net/vuenuxt01?retryWrites=true&w=majority',
  JWT_SERCRET: process.env.JWT_SERCRET || 'secret1',
  LINE_BOT: process.env.LINE_BOT || 'Xqhu17b67WG2rcuDibCjTB1oJ1mCtajcuh/dUM2AYpO+M8yb82DiN8XpfTW5It9iJEualWSU8GCPZ3ZFvHmODeJpzsdBvUy6vW5SnVBdOeVACMug5M/hLOb3m7iDdK0xdr8zBmcma5AZZkQog0JLjQdB04t89/1O/w1cDnyilFU=',
  LINE_NOTIFY_ME: process.env.LINE_NOTIFY_ME || 'ouB1sw0e0O9uctoDP6btlBsSIONFFDjSKBsFC93wO0U',
  LINE_NOTIFY_FREE_LOTTO: process.env.LINE_NOTIFY_FREE_LOTTO || 'FBGsl5LHAmw6EvXeP4RR9fF7Coa4bqu15k1nLNQ0QOa',
  LINE_NOTIFY_LOTTO: process.env.LINE_NOTIFY_LOTTO || 'N5DTBPPRvQI5lOD9Aot3op1XakvGMQVCczcPiXC8URr',
  BANK_USERNAME: process.env.BANK_USERNAME || '',
  BANK_PASSWORD: process.env.BANK_PASSWORD || '',
  WP_USERNAME: process.env.WP_USERNAME || '',
  WP_PASSWORD: process.env.WP_PASSWORD || ''
}