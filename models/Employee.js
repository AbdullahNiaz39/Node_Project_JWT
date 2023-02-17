const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstName: { type: String, require: true },
  secondName: { type: String, require: true },
});

module.exports = mongoose.model("Employee", employeeSchema);
