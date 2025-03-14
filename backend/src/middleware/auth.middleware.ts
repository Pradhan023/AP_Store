import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "../model/user.model";


export const protectedroute = async(req:Request & {user?:IUser},res:Response,next:NextFunction)=>{
    try{
        const token = req.cookies.accessToken;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unthorized, No access token Provided"
            })
        }
        const decoded = jwt.verify(token,process.env.Access_Secret_Key!) as JwtPayload
        const user = await User.findOne({_id:decoded.userId}).select("-password"); //- ignore password
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        req.user = user;
        next()
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const adminroute = async(req:Request & {user?:IUser} , res:Response,next:NextFunction)=>{
    if(req.user?.role === "admin"){
        next();
    }
    else{
        return res.status(403).json({
            success:false,
            message:"Forbidden , Admin Only"
        })
    }
}