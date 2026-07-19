let mongoose = require("mongoose")
let path = require("path")
require("dotenv").config({path:path.resolve(__dirname,"../.env")})

let connectionString = process.env.CONNECTION_STRING;

if(!connectionString){
    throw new Error("CONNECTION_STRING is missing in .env")
}

mongoose.set("bufferCommands", false)

async function connectDB() {
    await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 5000,
        dbName: "examsys"
    })
    console.log("DB Connected")
}

module.exports = { connectDB, mongoose };

