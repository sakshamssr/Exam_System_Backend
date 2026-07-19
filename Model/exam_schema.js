let { mongoose } = require("../Database/db")

let question_schema = mongoose.Schema({
    questionText:{
        type:String,
        required:true,
        trim:true
    },
    options:{
        type:[String],
        required:true,
        validate:{
            validator:function(options){
                return Array.isArray(options) && options.length >= 2;
            },
            message:"At least two options are required"
        }
    },
    correctAnswer:{
        type:String,
        required:true,
        trim:true
    },
    marks:{
        type:Number,
        default:1,
        min:1
    }
})

let exam_schema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    subject:{
        type:String,
        required:true,
        trim:true
    },
    startsAt:{
        type:Date,
        required:true
    },
    durationMinutes:{
        type:Number,
        required:true,
        min:1
    },
    status:{
        type:String,
        enum:["draft","published","closed"],
        default:"published"
    },
    questions:{
        type:[question_schema],
        default:[]
    }
},{
    timestamps:true
})

let Exam = mongoose.model("Exam", exam_schema);

module.exports = Exam;
