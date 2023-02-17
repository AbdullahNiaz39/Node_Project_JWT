const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fspromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: "username and paswword are required" });
  }
  //check for user duplicate in database
  const duplicate = userDB.users.find((person) => person.username === user);
  if (duplicate)
    return res.status(409).json({ message: "username already exist" }); //conflict
  try {
    // encrypt the password
    const hashedpwd = await bcrypt.hash(pwd, 10);
    // store the new user
    const newUser = {
      username: user,
      roles: {
        User: 5051,
      },
      password: hashedpwd,
    };
    userDB.setUsers([...userDB.users, newUser]);
    await fspromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(userDB.users)
    );
    console.log(userDB.users);
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  handleNewUser,
};
