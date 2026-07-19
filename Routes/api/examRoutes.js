let express = require("express")
let {listExams, getExam, createExam, updateExam, deleteExam} = require("../../Controller/examController")
let {submitAttempt} = require("../../Controller/attemptController")
let {authenticate, requireRole} = require("../../Middleware/auth")

let router = express.Router();

router.get("/",authenticate,requireRole("student","admin"),listExams)
router.get("/:id",authenticate,requireRole("student","admin"),getExam)
router.post("/:id/submit",authenticate,requireRole("student"),submitAttempt)

router.post("/admin/create",authenticate,requireRole("admin"),createExam)
router.put("/admin/:id",authenticate,requireRole("admin"),updateExam)
router.delete("/admin/:id",authenticate,requireRole("admin"),deleteExam)

module.exports = router;
