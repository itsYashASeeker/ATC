const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.sessionTimeMS)
    });
}

module.exports = generateToken;