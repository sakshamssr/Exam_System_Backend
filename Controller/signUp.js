let userData = require("../Model/signup_schema")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
let SECRET_KEY = "nmasdbhdA*!#*AHBQE!@W!8@"

let signup = async(req,res)=>{
    // console.log(req)
    // console.log(req.body)
    try {
        let {firstName,lastName,email,password,confirmpass,collegeName,course} = req.body;
        let existingUser = await userData.findOne({email:email});
        console.log(existingUser)
        if(!existingUser){
            if(password != confirmpass){
                return res.status(400).json({
                    success:false,
                    message: "Passwords do not match"
                })
            }
            else{
                let hashPassword = await bcrypt.hash(password,10)
                let user = await userData({
                    firstName:firstName,
                    lastName:lastName,
                    email:email,
                    password:hashPassword,
                    collegeName:collegeName,
                    course:course
                }).save()
                let token = jwt.sign({
                    firstName:firstName,
                    lastName:lastName,
                    email:user.email,
                    collegeName:user.collegeName,
                    course:user.course,
                    role:"student"
                },SECRET_KEY)
                return res.status(201).json({
                    success:true,
                    message:"User Created",
                    role:"student",
                    token:token
                })
            }
        }
        else{
            return res.status(409).json({
                success:false,
                message:"User Already Exists, Please Login"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error
        })
    }

}

module.exports = signup;
