let { mongoose } = require("../Database/db")

let signup_schema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    collegeName:{
        type:String,
        required:true,
        trim:true
    },
    course:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        enum:["student","admin"],
        default:"student"
    }
},{
    timestamps:true
})

let userData = mongoose.model("userData", signup_schema);

module.exports = userData;
