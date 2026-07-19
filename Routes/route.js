let express = require("express")
let status = require("../Controller/status")
let signup = require("../Controller/signUp")
let loginUser = require("../Controller/login")
let getExams = require("../Controller/exam")
let updateProfile = require("../Controller/profile")
let {listStudents, createStudent} = require("../Controller/adminStudent")

let route = express();

route.get("/",status)
route.post("/api/signup",signup)
route.post("/api/login",loginUser)
route.get("/api/exams",getExams)
route.put("/api/profile",updateProfile)
route.get("/api/admin/students",listStudents)
route.post("/api/admin/students",createStudent)

module.exports = route; 
