const jwt = require('jsonwebtoken');
const User = require('../models/User')

const authMiddleware = async(req,res,next) => {
    const authHeader = req.headers.authorization;

    //console.log("Received token: ",authHeader);
    if(authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')){
        const token = authHeader.split(' ')[1];

        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if(!user){
                return res.status(401).json({message:'User not found'});
            }

            user['userId'] = decoded.userId;
            req.user = user;
            next();

        } catch(err){
            //console.error("JWT error: ", err.message);
            res.status(401).json({message: "Invalid or Expired Token"});
        }
    } else {
        return res.status(401).json({message:'No token provided'});
    }
};

module.exports = authMiddleware;