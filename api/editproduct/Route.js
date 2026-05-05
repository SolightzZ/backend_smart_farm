const { Router } = require("express");
const router = Router();
const editfarmController = require("./Controller");

router.get("/editproduct", editfarmController.getEditproduct);
router.post("/editproduct", editfarmController.postCreateEditproduct);

module.exports = router;
