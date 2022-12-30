// config/configuration.ts

export default () => ({
  mode: process.env.MODE,
  ssl: process.env.SSL,
  domain: process.env.DOMAIN,
  port: parseInt(process.env.PORT, 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRESIN,
  },
  cookieSecret: process.env.COOKIE_SECRET,
});
