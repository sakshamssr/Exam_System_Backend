let exams = [
    {
        id: 1,
        title: "Mid Semester Assessment",
        subject: "Data Structures",
        date: "2026-07-12",
        time: "10:00 AM",
        duration: "90 minutes",
        status: "Upcoming"
    },
    {
        id: 2,
        title: "Practice Test",
        subject: "Database Management",
        date: "2026-07-14",
        time: "02:00 PM",
        duration: "60 minutes",
        status: "Open"
    },
    {
        id: 3,
        title: "Final Mock Exam",
        subject: "Operating Systems",
        date: "2026-07-17",
        time: "09:30 AM",
        duration: "120 minutes",
        status: "Upcoming"
    }
]

let getExams = (req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Exams Found",
        data:exams
    })
}

module.exports = getExams;
