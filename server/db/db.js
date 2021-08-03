const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://postgres:8150@localhost:5432/messenger",
  {
    logging: false,
    options: {
      dialect: "postgres",
      ssl: true,
      dialectOptions: {
        ssl: true,
      },
    },
  }
);

module.exports = db;
