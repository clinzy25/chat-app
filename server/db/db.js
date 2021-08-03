const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://postgres:8150@localhost:5432/messenger?ssl=true",
  {
    logging: false,
  }
);

module.exports = db;
