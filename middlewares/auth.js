import { catchAsyncError } from "./catchAsyncError"
import ErrorHandler from "./error";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("User not authorized",401))
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
})