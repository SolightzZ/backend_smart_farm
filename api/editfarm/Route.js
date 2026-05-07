const { Router } = require("express");
const router = Router();
const editfarmController = require("./Controller");

router.get("/getfarm", editfarmController.getEditfarm);
router.post("/postfarm", editfarmController.postCreateEditfarm);
router.put("/getfarm/:id", editfarmController.putUpdateEditfarm);
module.exports = router;
