let express = require("express")
let {listStudents, createStudent} = require("../../Controller/studentController")
let {authenticate, requireRole} = require("../../Middleware/auth")

let router = express.Router();

router.get("/",authenticate,requireRole("admin"),listStudents)
router.post("/",authenticate,requireRole("admin"),createStudent)

module.exports = router;
