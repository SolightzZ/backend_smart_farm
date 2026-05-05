const { Router } = require("express");
const router = Router();
const dashboardController = require("./Controller");

router.get("/dashboard", dashboardController.getDashboard);
router.post("/dashboard", dashboardController.postCreateDashboard);

module.exports = router;
