let express = require("express")
let {getProfile, updateProfile} = require("../../Controller/profileController")
let {authenticate, requireRole} = require("../../Middleware/auth")

let router = express.Router();

router.get("/",authenticate,requireRole("student"),getProfile)
router.put("/",authenticate,requireRole("student"),updateProfile)

module.exports = router;
