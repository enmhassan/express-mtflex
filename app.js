const express = require("express");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv").config();
const cors = require("cors");
const sequelize = require("./config/db");
const db = require("./models");

const app = express();
var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Authentication routes
app.use(authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
});

// db.sequelize.sync({ force: false }).then(function () {
//     app.listen(PORT, () => {
//         console.log(`SERVER STARTED ON PORT ${PORT}`);
//         // initial();
//     });
// });
