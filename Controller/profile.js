let userData = require("../Model/signup_schema")
let jwt = require("jsonwebtoken")
let SECRET_KEY = "nmasdbhdA*!#*AHBQE!@W!8@"

let updateProfile = async(req,res)=>{
    try {
        let {currentEmail, firstName, lastName, email, collegeName, course} = req.body;

        if(!currentEmail){
            return res.status(400).json({
                success:false,
                message:"Current email is required"
            })
        }

        let user = await userData.findOne({email:currentEmail});

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        if(email && email !== currentEmail){
            let existingUser = await userData.findOne({email:email});
            if(existingUser){
                return res.status(409).json({
                    success:false,
                    message:"Email Already Exists"
                })
            }
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.collegeName = collegeName || user.collegeName;
        user.course = course || user.course;

        await user.save();

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
            message:"Profile Updated",
            token:token,
            data:{
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                collegeName:user.collegeName,
                course:user.course
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong",
            error:error
        })
    }
}

module.exports = updateProfile;
