import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true,"Please provide job title"],
        minLength : [3,"Job title must contain atleast three characters"],
        maxLength : [50,"Job title can not exceed 50 characters"]
    },
    description : {
        type : String,
        required : [true,"Please provide job description"],
        minLength : [50,"Job description must contain atleast 50 characters"],
        maxLength : [350,"Job description can not exceed 350 characters"]
    },
    category : {
        type : String,
        required : [true,"Job category is required"],
    },
    country : {
        type : String,
        required : [true,"Job country is required"],
    },
    city : {
        type : String,
        required : [true,"Job city is required"]
    },
    location : {
        type : String,
        required : [true,"Please provide exact location"],
            minLength :[20,"Job location must contain atlease 50 characters"]
    },
    fixedSalary : {
        type : Number,
        minLength : [4,"Fixed Salary must contain atleast 4 digits"],
        maxLength : [9,"Fixed Salary cannot exceed 9 digits"]
    },
    salaryFrom : {
        type : Number,
        minLength : [4,"Fixed Salary must contain atleast 4 digits"],
        maxLength : [9,"Fixed Salary cannot exceed 9 digits"]
    },
    salaryTo : {
        type : Number,
        minLength : [4,"Fixed Salary must contain atleast 4 digits"],
        maxLength : [9,"Fixed Salary cannot exceed 9 digits"]
    },
    expired : {
        type : Boolean,
        default : false,
    },
    jobPostedOn : {
        type : Date,
        default : Date.now()
    },
    postedBy : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    }
})

export const Job = mongoose.model("Job",jobSchema)