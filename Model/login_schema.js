let { mongoose } = require("../Database/db")

let login_schema = mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

let loginDB = mongoose.model("userData", login_schema)

module.exports = loginDB;