const Sequelize = require('sequelize')

const db = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: 3002,
    dialect: 'postgres',
  }
)

module.exports = db
