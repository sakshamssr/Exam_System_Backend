let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
let path = require("path")
let User = require("../Model/signup_schema")
require("dotenv").config({path:path.resolve(__dirname,"../.env")})

let SECRET_KEY = process.env.SECRET_KEY;
let adminEmail = process.env.ADMIN_EMAIL;
let adminPassword = process.env.ADMIN_PASSWORD;

let buildToken = (user)=>jwt.sign({
    id:user._id,
    email:user.email,
    name:{
        firstName:user.firstName,
        lastName:user.lastName
    },
    collegeName:user.collegeName,
    course:user.course,
    role:user.role
},SECRET_KEY)

let login = async(req,res)=>{
    try {
        let {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({success:false,message:"Email and password are required"})
        }

        if(email === adminEmail){
            if(password !== adminPassword){
                return res.status(400).json({success:false,message:"Invalid Admin Password"})
            }

            let adminUser = {
                _id:"admin",
                email:adminEmail,
                firstName:"ExamSys",
                lastName:"Admin",
                collegeName:"Administration",
                course:"System",
                role:"admin"
            }

            return res.status(200).json({
                success:true,
                message:"Admin Login Successfully",
                role:"admin",
                token:buildToken(adminUser)
            })
        }

        let user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"})
        }

        let matched = await bcrypt.compare(password,user.password);
        if(!matched){
            return res.status(400).json({success:false,message:"Invalid Password"})
        }

        return res.status(200).json({
            success:true,
            message:"Login Successfully",
            role:user.role,
            token:buildToken(user)
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

let signup = async(req,res)=>{
    try {
        let {firstName,lastName,email,password,confirmpass,collegeName,course} = req.body;

        if(!firstName || !lastName || !email || !password || !confirmpass || !collegeName || !course){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        if(password !== confirmpass){
            return res.status(400).json({success:false,message:"Passwords do not match"})
        }

        let existingUser = await User.findOne({email:email});
        if(existingUser){
            return res.status(409).json({success:false,message:"User Already Exists, Please Login"})
        }

        let hashPassword = await bcrypt.hash(password,10);
        let user = await User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashPassword,
            collegeName:collegeName,
            course:course,
            role:"student"
        }).save()

        return res.status(201).json({
            success:true,
            message:"User Created",
            role:"student",
            token:buildToken(user)
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error",error:error.message})
    }
}

module.exports = {login, signup, buildToken};
