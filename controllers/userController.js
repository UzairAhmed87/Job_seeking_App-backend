import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js';
import {User} from '../models/userSchema.js'
import { sendToken } from '../utils/jwtToken.js';

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
    sendToken(user,200,res,"User Registered Successfully")
})

export const signIn = catchAsyncError(async(req,res,next)=>{
    const {email,password,role}= req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler("Please fill all fields",400))
    }
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid email or password",400))
    }
    const isPassword = await user.comparePassword(password)
    if(!isPassword){
        return next(new ErrorHandler("Invalid email or password",400))}
    if(user.role !== role){
        return next(new ErrorHandler("Invalid role",400))
    }
    sendToken(user,200,res,"User logged in successfully")
    res.status(200).json({
        success:true,
        message:"Signed in successfully"
    })
})

export const logout = catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie('token',"",{
        httpOnly : true,
        expires : new Date(Date.now()) 
    }).json({
        success : true,
        message : "User logged out successfully"
    })
})

export const getUser = catchAsyncError(async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success : true,
        user
    })
})