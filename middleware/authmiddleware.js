const jwt = require("jsonwebtoken");

const protectUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,

        (err, decoded) => {
          if (err)
            return res
              .status(403)
              .json({ message: "Invalid Token OR Token is Expire" }); //invalid token
          req.user = decoded.UserInfo.username;
          req.roles = decoded.UserInfo.roles;
          next();
        }
      );
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Not authorized" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, No token" });
  }
};
///rest is also used as when we sending multiple parameters

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    // it will get all the roles then check which role value will be a true
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};
module.exports = { protectUser, verifyRoles };
