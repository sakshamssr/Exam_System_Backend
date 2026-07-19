let express = require("express");
let cors = require("cors");
let path = require("path");
require("dotenv").config({path:path.resolve(__dirname,".env")})

let { connectDB } = require("./Database/db")
let authRoutes = require("./Routes/api/authRoutes")
let profileRoutes = require("./Routes/api/profileRoutes")
let studentRoutes = require("./Routes/api/studentRoutes")
let examRoutes = require("./Routes/api/examRoutes")
let resultRoutes = require("./Routes/api/resultRoutes")

let app = express();

app.use(cors())
app.use(express.json())

app.use((req,res,next)=>{
    console.log("HTTP: "+ req.method + req.url);
    next();
})

app.get("/",(req,res)=>res.json({success:true, message:"ExamSys API is running"}))
app.use("/api/auth",authRoutes)
app.use("/api/profile",profileRoutes)
app.use("/api/admin/students",studentRoutes)
app.use("/api/exams",examRoutes)
app.use("/api/results",resultRoutes)

let port = process.env.PORT || 5000;

async function main() {
    try {
        await connectDB()
        app.listen(port, ()=>{
            console.log("Running on port " + port)
        })
    } catch(error) {
        console.error("Failed to connect to DB:", error.message)
        process.exit(1)
    }
}

main()
