const Sequelize = require("sequelize");
const pg = require("pg");
pg.defaults.ssl = true;

const db = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://a4employee:8451@localhost:5432/messenger",
  {
    logging: false,
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: process.env.DATABASE_URL
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    },
  }
);

module.exports = db;
