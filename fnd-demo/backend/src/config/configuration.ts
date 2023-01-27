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
  signUpMessage: process.env.SIGNUP_MESSAGE,
  signInMessage: process.env.SIGNIN_MESSAGE,
  awsCredentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  awsBucket: process.env.AWS_BUCKET,
  s3Path: process.env.S3_PATH,
  web3Provider: process.env.WEB3_PROVIDER,
});
