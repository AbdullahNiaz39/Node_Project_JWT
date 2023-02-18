const User = require("../models/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const LoginUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: "username and paswword are required" });
  }
  const foundUser = await User.findOne({ username: user }).exec();

  if (!foundUser) return res.status(401); //Unauthorized
  //evaluate password

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWT
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "8h" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log(result);
    console.log(roles);
    res.status(200).json({ roles, accessToken });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { LoginUser };
