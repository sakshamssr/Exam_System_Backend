let jwt = require("jsonwebtoken")
let path = require("path")
require("dotenv").config({path:path.resolve(__dirname,"../.env")})

let SECRET_KEY = process.env.SECRET_KEY;

let authenticate = (req,res,next)=>{
    try {
        let authHeader = req.headers.authorization || "";
        let token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Authentication token is required"
            })
        }

        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        })
    }
}

let requireRole = (...roles)=>(req,res,next)=>{
    if(!roles.includes(req.user?.role)){
        return res.status(403).json({
            success:false,
            message:"Access denied"
        })
    }

    next();
}

module.exports = {authenticate, requireRole};
