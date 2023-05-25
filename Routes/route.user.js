const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const userRouter = express.Router();


//requiring models
const { UserModel } = require("../Models/user.model");




//user signup
userRouter.post("/signup",async(req,res)=>{

    const {name,email,password,gender,dateOfBirth} = req.body;
    if(email==undefined || email.length==0){
        res.status(400).send({success:false,message:"please provide email"});
        return
    }else if(password==undefined || password.length==0){
        res.status(400).send({success:false,message:"please provide password"});
        return;
    }else if(name==undefined || name.length==0){
        res.status(400).send({success:false,message:"please provide name"});
        return;
    }
    else if(gender==undefined || gender.length==0){
        res.status(400).send({success:false,message:"please provide gender"});
    }else if(dateOfBirth==undefined || dateOfBirth.length==0){
        res.status(400).send({success:false,message:"please provide dateOfBirth"});
    }
    else{
        //checking if user already exist with the provided email;
        let findExistUser  = await UserModel.findOne({email}); //return user if exist or null;
        if(findExistUser){
            res.status(400).send({success:false,message:"user already exist with the provided email"});
            return;
        }
        else{
            //now no user exist with the provided email be can continue to signup; (findExistUser=null);
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    console.log(err);
                    res.status(400).send({success:false,message:"something went wrong while hashing password"});
                    return;
                }else{
                    let newUser = await UserModel({name,email,password:hash,gender,dateOfBirth});
                    let savedNewUser = await newUser.save();
                    res.send({success:true,message:"signup successfull",data:savedNewUser});
                }
            });
        }
    }
});

userRouter.post("/signin",async(req,res)=>{
    const{email,password} = req.body;

    if(!email || email.length==0){
        res.status(400).send({success:false,message:"please provide email"});
    }else if(!password || password.length==0){
        res.status(400).send({success:false,message:"please provide password"});
    }else{
        try{
            //first verify user exist with provided email or not;
            let userFound = await UserModel.findOne({email});
            if(userFound){
                bcrypt.compare(password,userFound.password,(err,result)=>{
                    if(err){
                        console.log(err);
                        res.status(400).send({success:false,message:"something went wrong while comparing password",err})
                    }else{
                        console.log("login result",result);
                        const token = jwt.sign({ userId:userFound._id},`${process.env.JWT_KEY}`,{ expiresIn:"15 days"});
                        console.log("token from signin route",token);
                        res.json({success:true,message:"login successfull",token});
                    }
                })
            }else{
                //user doesn't exist with provided email;
                res.status(401).send({success:false,message:"wrong credentials"});
            }
        }
        catch(err){
            console.log(err);
            res.status(400).send({success:false,message:"something went wrong while finding user with provided email"});
        }
    }
});


module.exports = {
    userRouter
}

