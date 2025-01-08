import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        minLength:[3,"Your name must be at least 3 characters"],
        maxLength:[30,"Your name cannot exceed 30 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        validate:[validator.isEmail,"Please enter a valid email address"],
    },
    phone:{
        type:Number,
        required:[true,"Please enter your phone number"],
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Your password must be at least 8 characters"],
        maxLength:[32,"Your password cannot exceed 30 characters"]
    },
    role:{
        type:String,
        required:[true,"Please enter your role"],
        enum:["Job Seeker","Employer"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.getJWTToken = function(){
    jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
}