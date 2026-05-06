const { Router } = require("express");
const router = Router();
const dashboardController = require("./Controller");

router.get("/getdashboards", dashboardController.getDashboard);
router.post("/postdashboards", dashboardController.postCreateDashboard);

module.exports = router;
