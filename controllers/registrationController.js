const User = require("../models/User");

const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: "username and paswword are required" });
  }
  //check for user duplicate in database
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate)
    return res.status(409).json({ message: "username already exist" }); //conflict
  try {
    // encrypt the password
    const hashedpwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const newUser = User.create({
      username: user,
      password: hashedpwd,
    });

    // console.log(newUser);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  handleNewUser,
};
