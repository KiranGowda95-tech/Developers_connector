const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Users = require("../../models/Users");
const { check, validationResult } = require("express-validator");

//@route GET api/auth
//@desc Test route
//@access Public

router.get("/", auth, async (req, res) => {
  console.log("entering to auth backend point")
  try {
    console.log("entering to get endpoint auth")
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
    console.log("entering after endpoint auth");

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/auth
//@desc Authenticate user & get token
//@access Public

router.post(
  "/",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "Password id required").exists(),
  ],
  async (req, res) => {
    console.log("entering to auth post");
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //See if user exists
      console.log("entered into the before user");
      let user = await Users.findOne({ email });
      console.log("entered into the after user");

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      console.log("entering to before isMatch");
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("from routes auth", isMatch);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      // return res.send("User registered");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
