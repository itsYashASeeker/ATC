const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const authorize = asyncHandler(async (req, res, next) => {
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        
        try {
            token = req.headers.authorization.split(" ")[1];
            
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decodedToken.id).select("-password");
            console.log(req.user);
            // res.status(200);
            next();
        }
        catch (err) {
            res.status(401);
            throw new Error("Authorization failed!");
        }
    }
    else {
        res.status(401);
        throw new Error("Authorization failed!");
    }

});

module.exports = authorize;

