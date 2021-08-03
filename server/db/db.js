const Sequelize = require("sequelize");
const pg = require("pg");
pg.defaults.ssl = true;

const db = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://postgres:8150@localhost:5432/messenger",
  {
    logging: false,
    options: {
      dialect: "postgres",
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  }
);

module.exports = db;
