const Sequelize = require('sequelize')

const {
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST_PROD,
  POSTGRES_PORT_PROD,
  POSTGRES_HOST_DEV,
  POSTGRES_PORT_DEV,
  NODE_ENV,
} = process.env

const config =
  NODE_ENV === 'production'
    ? {
        host: POSTGRES_HOST_PROD,
        port: POSTGRES_PORT_PROD,
        dialect: 'postgres',
        dialectOptions: {
          ssl: 'Amazon RDS',
        },
      }
    : {
        host: POSTGRES_HOST_DEV,
        port: POSTGRES_PORT_DEV,
        dialect: 'postgres',
      }

const db = new Sequelize(
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  config
)

module.exports = db
