let Exam = require("../Model/exam_schema")

let defaultExams = [
    {
        title:"Data Structures Basics",
        subject:"Data Structures",
        startsAt:new Date("2026-07-25T10:00:00+05:30"),
        durationMinutes:30,
        status:"published",
        questions:[
            {questionText:"Which data structure follows LIFO?",options:["Queue","Stack","Tree","Graph"],correctAnswer:"Stack",marks:1},
            {questionText:"Which traversal visits left, root, right?",options:["Preorder","Inorder","Postorder","Level order"],correctAnswer:"Inorder",marks:1},
            {questionText:"Binary search works on which data?",options:["Unsorted","Sorted","Random","Hashed"],correctAnswer:"Sorted",marks:1}
        ]
    },
    {
        title:"DBMS Practice Test",
        subject:"Database Management",
        startsAt:new Date("2026-07-27T14:00:00+05:30"),
        durationMinutes:40,
        status:"published",
        questions:[
            {questionText:"SQL stands for?",options:["Structured Query Language","Simple Query Logic","System Query Link","Stored Query Language"],correctAnswer:"Structured Query Language",marks:1},
            {questionText:"Which key uniquely identifies a row?",options:["Foreign key","Candidate key","Primary key","Composite value"],correctAnswer:"Primary key",marks:1},
            {questionText:"Normalization mainly reduces?",options:["Security","Redundancy","Queries","Indexes"],correctAnswer:"Redundancy",marks:1}
        ]
    }
]

let ensureDefaultExams = async()=>{
    let count = await Exam.countDocuments();
    if(count === 0){
        await Exam.insertMany(defaultExams)
    }
}

let sanitizeExam = (exam)=>{
    let plain = exam.toObject ? exam.toObject() : exam;
    return {
        ...plain,
        questions:(plain.questions || []).map((question)=>({
            _id:question._id,
            questionText:question.questionText,
            options:question.options,
            marks:question.marks
        }))
    }
}

let listExams = async(req,res)=>{
    try {
        await ensureDefaultExams();
        let filter = req.user?.role === "admin" ? {} : {status:"published"};
        let exams = await Exam.find(filter).sort({startsAt:1});
        return res.status(200).json({
            success:true,
            message:"Exams Found",
            data:exams.map((exam)=>req.user?.role === "admin" ? exam : sanitizeExam(exam))
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

let getExam = async(req,res)=>{
    try {
        let exam = await Exam.findById(req.params.id);
        if(!exam){
            return res.status(404).json({success:false,message:"Exam Not Found"})
        }

        if(req.user?.role !== "admin" && exam.status !== "published"){
            return res.status(403).json({success:false,message:"Exam is not available"})
        }

        return res.status(200).json({
            success:true,
            message:"Exam Found",
            data:req.user?.role === "admin" ? exam : sanitizeExam(exam)
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

let createExam = async(req,res)=>{
    try {
        let {title,subject,startsAt,durationMinutes,status,questions} = req.body;
        if(!title || !subject || !startsAt || !durationMinutes || !Array.isArray(questions) || questions.length === 0){
            return res.status(400).json({success:false,message:"Exam details and questions are required"})
        }

        let exam = await Exam({
            title:title,
            subject:subject,
            startsAt:startsAt,
            durationMinutes:durationMinutes,
            status:status || "published",
            questions:questions
        }).save()

        return res.status(201).json({success:true,message:"Exam Created",data:exam})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

let updateExam = async(req,res)=>{
    try {
        let exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        if(!exam){
            return res.status(404).json({success:false,message:"Exam Not Found"})
        }

        return res.status(200).json({success:true,message:"Exam Updated",data:exam})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

let deleteExam = async(req,res)=>{
    try {
        let exam = await Exam.findByIdAndDelete(req.params.id);
        if(!exam){
            return res.status(404).json({success:false,message:"Exam Not Found"})
        }

        return res.status(200).json({success:true,message:"Exam Deleted"})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something Went Wrong",error:error.message})
    }
}

module.exports = {listExams, getExam, createExam, updateExam, deleteExam};
