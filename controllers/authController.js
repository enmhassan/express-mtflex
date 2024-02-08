const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv").config();
const Role = require("../models/role");
const User = require("../models/user").User;
const UserRoles = require("../models/user").UserRoles;

class UserController {
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ where: { email: email } });
      if (existingUser) {
        return res.status(400).json({ error: "User Already Exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userId = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
      });
      //addRole is sequelize built in function - adder - add+modelname
      const role = req.body.role;
      const roleId = await Role.findOne({ where: { name: role } });
      const addUserRole = await userId.addRole(roleId);

      res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  }

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const SECRET_KEY = process.env.SECRET_KEY;

    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }
      //Generate access token
      const accessToken = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1m",
      });
      //Generate refresh token (you can also save this to db)
      const refreshToken = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1d",
      });
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Access-Control-Expose-Headers", "authorization")
        .header("authorization", accessToken)
        .send(user.username);
      // res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  }

  static async refresh(req, res) {
    const refreshToken = req.headers.cookie.slice(13);

    if (!refreshToken) {
      return res.status(401).send("Access Denied, No refresh token provided");
    }

    const SECRET_KEY = process.env.SECRET_KEY;

    try {
      const decoded = jwt.verify(refreshToken, SECRET_KEY);
      const accessToken = jwt.sign({ userId: decoded.userId }, SECRET_KEY, {
        expiresIn: "1m",
      });
      console.log("New accessToken" + accessToken);
      res
        .status(200)
        .header("Access-Control-Expose-Headers", "authorization")
        .header("authorization", accessToken)
        .send({ message: "new accesstoken sent" });
    } catch (error) {
      console.log(error);
      return res.status(400).send("Invalid refresh token");
    }
  }

  static async logout(req, res) {
    res.status(200).clearCookie("refreshToken").end();
  }

  static async addNewRole(req, res) {
    const { name } = req.body;
    try {
      const existingRole = await Role.findOne({ where: { name: name } });
      if (existingRole) {
        return res.status(400).json({ error: "Role Already Exists" });
      }

      const role = await Role.create({
        name: name,
      });
      res.status(201).json({ message: "Role Added Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  }

  static async roles(req, res) {
    const roles = await Role.findAll();
    return res.status(200).send(roles);
  }

  static async user(req, res) {
    const user = await User.findOne({ where: { id: req.userId } });
    return res.status(200).send(user.email);
  }
}

module.exports = UserController;
