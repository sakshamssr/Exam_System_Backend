let adminData = require("../Model/signup_schema")

let users = async()=>{
    let data = await adminData.find({}).lean();
    for(const i of data){
        delete i.password;
    }
    console.log("Data: ",data)
    console.log(typeof data)
    return {
        success:true,
        message:"Data Found",
        data:data
    }
}

module.exports = users;