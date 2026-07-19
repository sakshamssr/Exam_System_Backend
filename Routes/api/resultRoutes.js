let express = require("express")
let {getStudentResults, getAllResults} = require("../../Controller/attemptController")
let {authenticate, requireRole} = require("../../Middleware/auth")

let router = express.Router();

router.get("/",authenticate,requireRole("student"),getStudentResults)
router.get("/admin",authenticate,requireRole("admin"),getAllResults)

module.exports = router;
