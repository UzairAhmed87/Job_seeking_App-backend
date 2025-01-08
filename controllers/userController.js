import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js';
import {User} from '../models/userSchema.js'

export const register = catchAsyncError(async(req,res,next)=>{
    const {name,email,role,phone,password}= req.body;
    if(!name || !email || !role || !phone || !password){
        return next(new ErrorHandler("Please fill all fields",400))
    }
    const isEmail = await User.findOne({email})
    if(isEmail){
        return next(new ErrorHandler("Email already exists",400))
    }
    const user = await User.create({
        name,
        email,
        role,
        phone,
        password
    })
    res.status(200).json({
        success:true,
        message:"User registered successfully",
        user
    })
})
export const signIn = catchAsyncError(async(req,res,next)=>{
    const {email,password}= req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please fill all fields",400))
    }
    const isEmail = await User.findOne({email}).select("+password")
    if(!isEmail){
        return next(new ErrorHandler("Invalid email or password",400))
    }
    const isPassword = await isEmail.comparePassword(password)
    if(!isPassword){
        return next(new ErrorHandler("Invalid email or password",400))}
    res.status(200).json({
        success:true,
        message:"Signed in successfully"
    })
})