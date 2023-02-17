require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const { protectUser } = require("./middleware/authmiddleware");
const users = require("./routes/users");
const register = require("./routes/register");
const authLogin = require("./routes/authLogin");
const refreshToken = require("./routes/refreshToken");
const logout = require("./routes/logout");
const employees = require("./routes/api/employees");
const { logger } = require("./middleware/logEvents");
const path = require("path");
const errorHandler = require("./middleware/errorHandlder");
const { corsOptions } = require("./config/corsOptions");
const cookiePraser = require("cookie-parser");
const morgan = require("morgan");
const credentials = require("./middleware/credentials");
const connectDB = require("./config/dbConn");
app.use(morgan("dev"));
const PORT = 3500 || process.env.PORT;

//DataBase Connected
connectDB();

//custom middleware logger
app.use(logger);

///handle check credentials before Cors
app.use(credentials);

app.use(cors(corsOptions));
/// this operation  data?.name is called operational chaining

//this middleware to handle unrlencoded data mean,form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//this middleware is for json
app.use(express.json());

//middleware for cookiepraser
app.use(cookiePraser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("/users", users);
app.use("/register", register);
app.use("/login", authLogin);
app.use("/refresh", refreshToken);
app.use("/logout", logout);

app.use(protectUser);
app.use("/employees", employees);

// for Error
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
