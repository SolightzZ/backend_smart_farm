const { Router } = require("express");

const router = Router();
const profileController = require("./Controller");

router.get("/getprofile", profileController.getProfile);
router.post("/postprofile", profileController.postCreateProfile);
router.put("/getprofile/:id", profileController.putUpdateProfile);

module.exports = router;
