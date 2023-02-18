const User = require("../models/User");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogout = async (req, res) => {
  // On Client, also delete the accessToken
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); //No Content
  }

  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const foundUser = User.findOne({
    refreshToken,
  });
  // is refreshToken in DB?
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); //not found USer
  }

  // Delete refreshToken in db
  // const otherUsers = User.filter(
  //   (person) => person.refreshToken !== foundUser.refreshToken
  // );
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
