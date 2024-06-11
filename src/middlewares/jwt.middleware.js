import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
const jwtAuth = (req, res, next)=>{
    // 1. Read the token
    const token = req.headers["authorization"];

    console.log(token);
    
    // 2.if no token, return the error
    if(!token){
        return res.status(401).send("Unauthorzied");
    }
    
    // 3.check if token is valid 
    try{
        const payload = jwt.verify(
            token,
            "IPZH0HyJzrZEVVqmencxS98lJplU614e"
        );
        // Attaching payload userID to the requested userID i.e request object
        req.userID = payload.userID;
        console.log(payload);
    }catch (err) {
        // 4.return error
        console.log(err);
        return res.status(401).send("Unauthorized");
    }
    // 5.call next middleware
    next();
};

export default jwtAuth;