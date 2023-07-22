const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const authorize = asyncHandler(async (req, res, next) => {

    if (req.headers.cookie) {
        var token = req.headers.cookie.split("uToken=")[1];
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decodedToken.id).select("-password");
            next();
        } catch (error) {
            res.status(402).json({ "error": ["Some error occured while authenticating user"] })
        }
    }
    else {
        res.status(402).json({ "error": ["You are not authorized"] });
    }

});

module.exports = authorize;

