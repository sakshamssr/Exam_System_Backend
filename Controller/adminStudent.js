let userData = require("../Model/signup_schema")
let bcrypt = require("bcrypt")

let listStudents = async(req,res)=>{
    try {
        let students = await userData.find({}).select("-password").lean();
        return res.status(200).json({
            success:true,
            message:"Students Found",
            data:students
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong",
            error:error
        })
    }
}

let createStudent = async(req,res)=>{
    try {
        let {firstName,lastName,email,password,confirmpass,collegeName,course} = req.body;

        if(!firstName || !lastName || !email || !password || !confirmpass || !collegeName || !course){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(password !== confirmpass){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"
            })
        }

        let existingUser = await userData.findOne({email:email});
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"User Already Exists"
            })
        }

        let hashPassword = await bcrypt.hash(password,10)
        let student = await userData({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashPassword,
            collegeName:collegeName,
            course:course
        }).save()

        return res.status(201).json({
            success:true,
            message:"Student Created",
            data:{
                _id:student._id,
                firstName:student.firstName,
                lastName:student.lastName,
                email:student.email,
                collegeName:student.collegeName,
                course:student.course
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

module.exports = {listStudents, createStudent};
