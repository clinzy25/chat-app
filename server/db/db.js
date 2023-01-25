const Sequelize = require('sequelize')
const pg = require('pg')
pg.defaults.ssl = true

const db = new Sequelize(
  'postgres://a4employee:8451@localhost:5432/messenger',
  {
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false,
    },
  }
)

module.exports = db
