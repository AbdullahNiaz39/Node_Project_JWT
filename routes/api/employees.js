const express = require("express");
const router = express.Router();
const ROLES_LISTS = require("../../config/roles_list");
const { verifyRoles } = require("../../middleware/authmiddleware");
const {
  getAllEmployees,
  getEmployee,
  deleteEmployees,
  createEmployees,
  updateEmployees,
} = require("../../controllers/employeesController");

router
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LISTS.Admin, ROLES_LISTS.Editor), createEmployees)
  .put(verifyRoles(ROLES_LISTS.Admin, ROLES_LISTS.Editor), updateEmployees)
  .delete(verifyRoles(ROLES_LISTS.Admin), deleteEmployees);

router.route("/:id").get(getEmployee);

module.exports = router;
