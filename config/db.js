const { Sequelize } = require("sequelize");
const dotenv = require("dotenv").config();

// Not used with sqlite
// const database = process.env.DB_NAME;
// const username = process.env.DB_USER;
// const password = process.env.DB_PASSWORD;
// const host = process.env.DB_HOST;

// const sequelize = new Sequelize(database, username, password, {
//   host: host,
//   dialect: "mysql",
// });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});

(async function () {
  try {
    await sequelize.authenticate();
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.error("UNABLE TO CONNECT TO DB", error);
  }
})();

module.exports = sequelize;
