const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    console.log(err);
    return res
      .status(401)
      .send({ message: "Unauthorized! Access token was expired" });
  }
  return res.status(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
  let accessToken = req.headers["authorization"];
  if (!accessToken) {
    return res.status(403).json({ message: "No Token Provided" });
  }

  const SECRET_KEY = process.env.SECRET_KEY;

  jwt.verify(accessToken, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return catchError(err, res);
    }
    req.userId = decoded.userId;
    next();
  });
};

// const verifyToken = (req, res, next) => {
//   let accessToken = req.headers["authorization"];
//   let refreshToken = req.headers.cookie.slice(13);
//   if (!accessToken && !refreshToken) {
//     return res
//       .status(403)
//       .send({ message: " Access Denied. No Token Provided " });
//   }

//   const SECRET_KEY = process.env.SECRET_KEY;

//   try {
//     const decoded = jwt.verify(accessToken, SECRET_KEY);
//     req.user = decoded.user;
//     res.json(decoded.userId);
//   } catch (error) {
//     if (!refreshToken) {
//       return res.status(401).send("Access Denied. No refresh token provided");
//     }

//     try {
//       const decoded = jwt.verify(refreshToken, SECRET_KEY);
//       const accessToken = jwt.sign({ userId: decoded.userId }, SECRET_KEY, {
//         expiresIn: "10m",
//       });
//       res
//         .status(200)
//         .cookie("refreshToken", refreshToken, {
//           httpOnly: true,
//           sameSite: "strict",
//         })
//         .header("Access-Control-Expose-Headers", "authorization")
//         .header("authorization", accessToken)
//         .json(decoded.userId)
//         .next();
//     } catch (error) {
//       console.log(error);
//       return res.status(400).send("Invalid Token");
//     }
//   }
// };

module.exports = { catchError, verifyToken };
