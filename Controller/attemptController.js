let Attempt = require("../Model/attempt_schema")
let Exam = require("../Model/exam_schema")

let submitAttempt = async(req,res)=>{
    try {
        let {answers} = req.body;
        let exam = await Exam.findById(req.params.id);

        if(!exam || exam.status !== "published"){
            return res.status(404).json({success:false,message:"Exam Not Found"})
        }

        let existingAttempt = await Attempt.findOne({student:req.user.id, exam:exam._id});
        if(existingAttempt){
            return res.status(409).json({success:false,message:"You have already submitted this exam"})
        }

        let submittedAnswers = Array.isArray(answers) ? answers : [];
        let score = 0;
        let totalMarks = exam.questions.reduce((total,question)=>total + question.marks, 0);

        let evaluatedAnswers = exam.questions.map((question)=>{
            let answer = submittedAnswers.find((item)=>String(item.questionId) === String(question._id));
            let selectedAnswer = answer?.selectedAnswer || "";
            let isCorrect = selectedAnswer === question.correctAnswer;

            if(isCorrect){
                score += question.marks;
            }

            return {
                questionId:String(question._id),
                selectedAnswer:selectedAnswer,
                isCorrect:isCorrect
            }
        })

        let attempt = await Attempt({
            student:req.user.id,
            exam:exam._id,
            answers:evaluatedAnswers,
            score:score,
            totalMarks:totalMarks,
            percentage:totalMarks ? Math.round((score / totalMarks) * 100) : 0
        }).save()

        return res.status(201).json({success:true,message:"Exam Submitted",data:attempt})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

let getStudentResults = async(req,res)=>{
    try {
        let attempts = await Attempt.find({student:req.user.id}).populate("exam","title subject startsAt durationMinutes").sort({submittedAt:-1}).lean();
        return res.status(200).json({success:true,message:"Results Found",data:attempts})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

let getAllResults = async(req,res)=>{
    try {
        let attempts = await Attempt.find({})
            .populate("student","firstName lastName email collegeName course")
            .populate("exam","title subject startsAt durationMinutes")
            .sort({submittedAt:-1})
            .lean();

        return res.status(200).json({success:true,message:"Results Found",data:attempts})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

module.exports = {submitAttempt, getStudentResults, getAllResults};
