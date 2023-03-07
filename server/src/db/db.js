const Sequelize = require('sequelize')
const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
})

const {
  POSTGRES_DATABASE,
  POSTGRES_USER_PROD,
  POSTGRES_PASSWORD_PROD,
  POSTGRES_USER_DEV,
  POSTGRES_PASSWORD_DEV,
  POSTGRES_HOST_PROD,
  POSTGRES_PORT_PROD,
  POSTGRES_HOST_DEV,
  POSTGRES_PORT_DEV,
  NODE_ENV,
} = process.env

const username =
  NODE_ENV === 'production' ? POSTGRES_USER_PROD : POSTGRES_USER_DEV
const password =
  NODE_ENV === 'production' ? POSTGRES_PASSWORD_PROD : POSTGRES_PASSWORD_DEV

const config =
  NODE_ENV === 'production'
    ? {
        host: POSTGRES_HOST_PROD,
        port: POSTGRES_PORT_PROD,
        dialect: 'postgres',
        dialectOptions: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: POSTGRES_HOST_DEV,
        port: POSTGRES_PORT_DEV,
        dialect: 'postgres',
      }

const db = new Sequelize(POSTGRES_DATABASE, username, password, config)
console.log(POSTGRES_DATABASE,
  POSTGRES_USER_PROD,
  POSTGRES_PASSWORD_PROD,
  POSTGRES_USER_DEV,
  POSTGRES_PASSWORD_DEV,
  POSTGRES_HOST_PROD,
  POSTGRES_PORT_PROD,
  POSTGRES_HOST_DEV,
  POSTGRES_PORT_DEV,
  NODE_ENV,)
module.exports = db
