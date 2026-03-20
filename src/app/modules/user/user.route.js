const express = require("express");
const {
  getAllUsers,
  getUserRole,
  updateRoleToAdmin,
  updateRoleToUser,
  deleteUser,
  getMe,
} = require("./user.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/me", auth(), getMe);
router.get("/userRoleCheck/:email", getUserRole);
router.patch("/AdminUpdateRoleAdmin/:id", updateRoleToAdmin);
router.patch("/AdminUpdateRoleUser/:id", updateRoleToUser);
router.delete("/AdminDeleteUsers/:id", deleteUser);

module.exports = router;
