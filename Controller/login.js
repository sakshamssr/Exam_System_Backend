let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
let loginDB = require("../Model/signup_schema")
let users = require("./admin")
let SECRET_KEY = "nmasdbhdA*!#*AHBQE!@W!8@"
let adminEmail = "admin@exam.com"
let adminPassword = "00000"


let loginUser = async(req,res)=>{
    try {
        let {email, password} = req.body;
        if(email == adminEmail){
            if(password == adminPassword){
                let token = jwt.sign({
                    email:adminEmail,
                    role:"admin"
                },SECRET_KEY)
                let adminUsers = await users();
                return res.status(200).json({
                    ...adminUsers,
                    role:"admin",
                    token:token
                });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Invalid Admin Password"
                })
            }
        }
        let user = await loginDB.findOne({email:email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }
        else{
            if(await bcrypt.compare(password,user.password)){
                let token = jwt.sign({
                    email:user.email,
                    name:{
                        firstName:user.firstName,
                        lastName:user.lastName
                    },
                    collegeName:user.collegeName,
                    course:user.course,
                    role:"student"
                },SECRET_KEY)
                return res.status(200).json({
                    success:true,
                    message:"login",
                    role:"student",
                    token:token
                })
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Invalid Password"
                })
            }
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong",
            error:error
        })
    }

}

module.exports = loginUser;
