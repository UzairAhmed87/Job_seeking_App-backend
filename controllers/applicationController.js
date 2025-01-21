import { Application } from "../models/applicationSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "cloudinary"
import { Job } from "../models/jobSchema.js";

export const employerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const role = req.user.role;
    if (role == "Job Seeker") {
      return next(
        new ErrorHandler(
          "Job Seeker is not allowed to access this resource",
          400
        )
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({
      "employerID.user": _id,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);
export const jobSeekerAllApplications = catchAsyncError(
  async (req, res, next) => {
    const role = req.user.role;
    if (role == "Employer") {
      return next(
        new ErrorHandler("Employer is not allowed to access this resource", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({
      "applicantID.user": _id,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobSeekerDeleteApplication = catchAsyncError(
  async (req, res, next) => {
    const role = req.user.role;
    if (role == "Employer") {
      return next(
        new ErrorHandler("Employer is not allowed to access this resource", 400)
      );
    }
    const { _id } = req.params;
    const application = await Application.findById(_id);
    if (!application) {
      return next(new ErrorHandler("Oops application not found", 400));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  }
);

export const postApplication = catchAsyncError(async (req, res, next) => {
  const role = req.user.role;
  if (role == "Employer") {
    return next(
      new ErrorHandler("Employer is not allowed to access this resource", 400)
    );
  }
  if(!req.files || Object.keys(req.files).length === 0)
  {
    return next(new ErrorHandler("Resume file is required",400))
  }
  const {resume} = req.files;
  const allowedFormats = ["img/png","img/jpg","img/webp"]
  if(!allowedFormats.includes(resume.mimeType)){
    return next/(new ErrorHandler("Invalid file type.File should be jpg,png or webp format",400))
  }
  const cloudinaryResponse = await cloudinary.UploadStream.upload(
    resume.tempFilePath
  );
  if(!cloudinaryResponse || cloudinaryResponse.error)
  {
    console.error("Cloudinary Error",cloudinaryResponse.error|| "Unknown Cloudinary Error");
    return next(new ErrorHandler("Failed to upload resume"),500);
  }
  const {name,email,coverLetter,phone,address,jobID} = req.body;
  const applicantID = {
    user : req.user._id,
    role : "Job Seeker"
  }
  if(!jobID){
    return next(new ErrorHandler("Job not found",404));
  }
  const jobDetails = await Job.findById(jobID);
  if(!jobDetails){
    return next(new ErrorHandler("Job not found",404));
  }
  const employerID = {
    user : jobDetails.postedBy,
    role : "Employer"
  }
  if(!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume)
  {
    return next(new ErrorHandler("Please fill all fields",400))
  }
  const application = Application.create({
    name,email,coverLetter,phone,address,applicantID,employerID,resume : {
      public_id : cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url 
    }
  })
  res.status(200).json({
    success : true,
    message : "Application submitted succcessfully",
    application
  })
});

 