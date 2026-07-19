let express = require("express");
let cors = require("cors");
let path = require("path");
require("dotenv").config({path:path.resolve(__dirname,".env")})

let app = express();
let status = require("./Controller/status")
let authRoutes = require("./Routes/api/authRoutes")
let profileRoutes = require("./Routes/api/profileRoutes")
let studentRoutes = require("./Routes/api/studentRoutes")
let examRoutes = require("./Routes/api/examRoutes")
let resultRoutes = require("./Routes/api/resultRoutes")

app.use(cors())
app.use(express.json())

app.use((req,res,next)=>{
    console.log("HTTP: "+ req.method + req.url);
    next();
})

app.get("/",status)
app.use("/api/auth",authRoutes)
app.use("/api/profile",profileRoutes)
app.use("/api/admin/students",studentRoutes)
app.use("/api/exams",examRoutes)
app.use("/api/results",resultRoutes)

let port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log("Running on port " + port)
})
