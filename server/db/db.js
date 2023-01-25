const Sequelize = require('sequelize')
const pg = require('pg')
pg.defaults.ssl = true

const db = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false,
    },
  }
)

module.exports = db
