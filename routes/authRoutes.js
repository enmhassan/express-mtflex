const express = require("express");
const UserController = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");
const { catchError } = require("../middleware/authJwt");
const router = express.Router();
const verifyToken = require("../middleware/authJwt").verifyToken;

router.post("/register", registerValidator, UserController.register);
router.post("/login", loginValidator, UserController.login);
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).send({ message: "Logged In" });
});
router.get("/user", verifyToken, UserController.user);
router.post("/refresh", UserController.refresh);
router.post("/logout", UserController.logout);
router.post("/add-role", UserController.addNewRole);
router.get("/roles", UserController.roles);

module.exports = router;
