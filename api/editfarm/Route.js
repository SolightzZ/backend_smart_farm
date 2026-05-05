const { Router } = require("express");
const router = Router();
const editfarmController = require("./Controller");

router.get("/editfarm", editfarmController.getEditfarm);
router.post("/editfarm", editfarmController.postCreateEditfarm);

module.exports = router;
