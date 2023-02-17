const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

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

  const foundUser = userDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  // is refreshToken in DB?
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); //not found USer
  }

  // Delete refreshToken in db
  const otherUsers = userDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  userDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(userDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
