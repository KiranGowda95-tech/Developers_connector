const jwt = require("jsonwebtoken");

const config = require("config");

module.exports = function (req, res, next) {
  //Get Token from header
  const token = req.header("x-auth-token");

  //Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No Token,authorization denied" });
  }

  //Verify Token
  try {
    console.log("entering before decoded")
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log("from auth decoded value",decoded)
    req.user = decoded.user;
    console.log("from auth file", req.user);
    console.log("from auth file", decoded.user);
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
