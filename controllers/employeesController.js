const Employee = require("../models/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) {
    res.status(204).json({ message: "No employees found" });
  }
  res.json(employees);
};

const createEmployees = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "Firstname and lastname is requied" });
  }
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

const updateEmployees = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employee matches ID  ${req.body.id}` });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();
  res.json(result);
};

const deleteEmployees = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `Employee ID is required` });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employee matches ID  ${req.body.id}` });
  }

  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: `Employee ID is required` });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employee matches ID  ${req.body.id}` });
  }
  res.json(employee);
};

module.exports = {
  getEmployee,
  deleteEmployees,
  updateEmployees,
  createEmployees,
  getAllEmployees,
};
