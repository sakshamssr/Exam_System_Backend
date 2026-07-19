let mongoose = require("mongoose")
let path = require("path")
require("dotenv").config({path:path.resolve(__dirname,"../.env")})

let connectionString = process.env.CONNECTION_STRING;

if(!connectionString){
    throw new Error("CONNECTION_STRING is missing in .env")
}

mongoose.set("bufferCommands", false)

mongoose.connect(connectionString,{
    serverSelectionTimeoutMS:5000,
    dbName:"examsys"
}).then(()=>{
    console.log("DB Connected")
}).catch((error)=>{
    console.log("Error in connecting DB", error.message)
})

module.exports = mongoose;
