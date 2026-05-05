const { Router } = require("express");
const router = Router();

const userController = require("./Controller");
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUser);
router.post("/users", userController.postCreateUser);
router.put("/users/:id", userController.putUpdateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
