import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncError(async (req, res, next) => {
  const role = req.user.role;
  if (role == "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not allowed to access this resource", 400)
    );
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;
  if (
    !title ||
    !description ||
    !category ||
    !country ||
    !city ||
    !location ||
    !fixedSalary ||
    !salaryFrom ||
    !salaryTo
  ) {
    return new ErrorHandler("Please provide all the details", 400);
  }
  if ((!salaryFrom && !salaryTo) || fixedSalary) {
    return new ErrorHandler(
      "Please either provide fixed salary or ranged salary"
    );
  }
  if (salaryFrom && salaryTo && fixedSalary) {
    return new ErrorHandler("Can not provide fixed and ranged salary together");
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job posted successfully",
    job,
  });
});
export const getMyJobs = catchAsyncError(async (req, res, next) => {
  const role = req.user.role;
  if (role == "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not allowed to access this resource", 400)
    );
  }
  const myJobs = await Job.find({
    postedBy: req.user._id,
  });
  res.status(200).json({
    success : true,
    myJobs
  })
});

export const updateJob = catchAsyncError(async(req,res,next)=>{
    const role = req.user.role;
  if (role == "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not allowed to access this resource", 400)
    );
}
const {id} = req.params;
let job = await Job.findById(id);
if(!job){
    return next(new ErrorHandler(
        "Oops job not found",
        404
    ))
}
job = await Job.findByIdAndUpdate(id,req.body,{
    new : true,
    runValidator : true,
    useFindAndModify : false
})
res.status(200).json({
    success : true,
    job,
    message : "Job updated successfully"
})
})

export const deleteJob = catchAsyncError(async(req,res,next)=>{
  const role = req.user.role;
  if (role == "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not allowed to access this resource", 400)
    );
}
const {id} = req.params;
let job = await Job.findById(id);
if(!job){
    return next(new ErrorHandler(
        "Oops job not found",
        404
    ))
}
await job.deleteOne();
res.status(200).json({
  success : true,
  message : "Job deleted successfully"
})
})