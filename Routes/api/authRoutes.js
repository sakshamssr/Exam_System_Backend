let express = require("express")
let {login, signup} = require("../../Controller/authController")

let router = express.Router();

router.post("/login",login)
router.post("/signup",signup)

module.exports = router;
