const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const fsPromises = require("fs").promises;
const path = require("path");

const LoginUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: "username and paswword are required" });
  }
  const foundUser = userDB.users.find((person) => person.username === user);

  if (!foundUser) return res.status(401); //Unauthorized
  //evaluate password

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWT
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const otherUsers = userDB.users.filter(
      (person) => person.username !== foundUser.username
    );

    //saving refreshToken with current user
    const currentUsers = { ...foundUser, refreshToken };
    userDB.setUsers([...otherUsers, currentUsers]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(userDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log(accessToken);
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { LoginUser };
