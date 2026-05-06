const { Router } = require("express");
const router = Router();
const editfarmController = require("./Controller");

router.get("/getfarm", editfarmController.getEditfarm);
router.post("/postfarm", editfarmController.postCreateEditfarm);

module.exports = router;
