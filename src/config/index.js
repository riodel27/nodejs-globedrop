require('dotenv').config()

module.exports = {
   development: {
      port: 3000,
      redisPort: 6379,
      logLevel: 'debug',
      nodeEnv: 'development',
      database: {
         url: 'mongodb://localhost:27017/globedrop',
      },
      accessTokenTtl: '24',
      secretToken: 'globedrop',
      secretRefreshToken: 'globedrop123',
      refreshTokenTtl: '30d',
      api: {
         prefix: '/api',
      },
   },
   production: {
      port: process.env.PORT,
      redisPort: process.env.REDIS_PORT,
      logLevel: process.env.LOG_LEVEL,
      nodeEnv: process.env.NODE_ENV,
      database: {
         url: process.env.MONGO_URI,
      },
      accessTokenTtl: process.env.SECRET_TOKEN_EXPIRED_IN,
      secretToken: process.env.SECRET_TOKEN_EXPIRED_IN,
      secretRefreshToken: process.env.SECRET_TOKEN,
      refreshTokenTtl: process.env.REFRESH_SECRET_TOKEN_EXPIRED_IN,
      api: {
         prefix: process.env.API_PREFIX,
      },
   },
   staging: {},
   test: {
      port: 3000,
      redisPort: 6379,
      logLevel: 'debug',
      nodeEnv: 'test',
      database: {
         url: 'mongodb://localhost:27017/TestGlobeDrop',
      },
      accessTokenTtl: '24',
      secretToken: 'globedrop',
      secretRefreshToken: 'globedrop123',
      refreshTokenTtl: '30d',
      api: {
         prefix: '/api',
      },
   },
}
