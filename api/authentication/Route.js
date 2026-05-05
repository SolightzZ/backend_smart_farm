const express = require("express");
const auth = express.Router();

const authController = require("./Controller");
const { nexAuthorixation } = require("../middleware/authorixation");

auth.post("/auth/login", authController.getUserLogin);
auth.post("/auth/signup", authController.signup);
auth.put(
  "/auth/change-password/:id",
  nexAuthorixation,
  authController.changePassword,
);

module.exports = auth;
