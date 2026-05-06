const { Router } = require("express");
const router = Router();
const editfarmController = require("./Controller");

router.get("/getproduct", editfarmController.getEditproduct);
router.post("/postproduct", editfarmController.postCreateEditproduct);

module.exports = router;
