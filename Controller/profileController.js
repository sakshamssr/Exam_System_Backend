let User = require("../Model/signup_schema")
let {buildToken} = require("./authController")

let getProfile = async(req,res)=>{
    try {
        let user = await User.findById(req.user.id).select("-password").lean();

        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"})
        }

        return res.status(200).json({success:true,message:"Profile Found",data:user})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

let updateProfile = async(req,res)=>{
    try {
        let {firstName,lastName,email,collegeName,course} = req.body;
        let user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({success:false,message:"User Not Found"})
        }

        if(email && email !== user.email){
            let existingUser = await User.findOne({email:email});
            if(existingUser){
                return res.status(409).json({success:false,message:"Email Already Exists"})
            }
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.collegeName = collegeName || user.collegeName;
        user.course = course || user.course;

        await user.save();

        return res.status(200).json({
            success:true,
            message:"Profile Updated",
            token:buildToken(user),
            data:{
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                collegeName:user.collegeName,
                course:user.course,
                role:user.role
            }
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

module.exports = {getProfile, updateProfile};
