const jwt = require("jsonwebtoken");
require("dotenv").config();


const authMiddleware = (req,res,next) =>{
    // console.log("headers in console",req.headers.authorization);
    const token = req.headers.authorization;
    // console.log("token from authorise middlelware",token);
    if(token){
        try{
            let decoded = jwt.verify(token,process.env.JWT_KEY);
            // console.log("decode from middleware",decoded);
            if(decoded){
                req.userId = decoded.userId; 
                next()
            }else{
                console.log("error from auth middleware",err);
                res.status(401).send({success:false,message:"you are not authenticated",err});
            }
        }
        catch(err){
            console.log(err);
            res.status(401).send({success:false,message:"something went wrong while verifing token",err});
        }
    }
    else{
        res.send({success:false,message:'please provide token in headers'});
    }
}


module.exports = {
    authMiddleware
}
