let mongoose = require("../Database/db")

let answer_schema = mongoose.Schema({
    questionId:{
        type:String,
        required:true
    },
    selectedAnswer:{
        type:String,
        required:true
    },
    isCorrect:{
        type:Boolean,
        default:false
    }
})

let attempt_schema = mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userData",
        required:true
    },
    exam:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam",
        required:true
    },
    answers:{
        type:[answer_schema],
        default:[]
    },
    score:{
        type:Number,
        default:0
    },
    totalMarks:{
        type:Number,
        default:0
    },
    percentage:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:["submitted"],
        default:"submitted"
    },
    submittedAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

attempt_schema.index({student:1, exam:1}, {unique:true})

let Attempt = mongoose.model("Attempt", attempt_schema);

module.exports = Attempt;
