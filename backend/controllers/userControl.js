const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateTok");

const createTVerf = () => {
    const referStrs = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let token = "";
    const tCounter = Math.floor(Math.random() * 15) + 10;
    for (var i = 0; i < tCounter; i++) {
        token += referStrs[Math.floor(Math.random() * referStrs.length)];
    }
    return token;
}

const RegisterUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(402).json({ error: ["Please fill all fields"] })
    }
    try {
        const userFound = await User.findOne({ $or: [{ username: username }, { email: username }] });
        if (userFound) {
            return res.status(402).json({ error: ["Account already registered with the username!"] });
        }
        const salt = await bcrypt.genSalt(8);
        const haPassword = await bcrypt.hash(password, salt);
        var isAdmin = false;
        if (username === process.env.adminU) {
            isAdmin = true;
        }
        const userCreated = await User.create({
            username,
            password: haPassword,
            isAdmin
        })
        const token = generateToken(userCreated._id);
        if (userCreated) {
            res
                .status(200)
                .cookie("uToken", token,
                    {
                        sameSite: "strict",
                        maxAge: Number(process.env.sessionTimeMS),
                        httpOnly: true,
                    })
                .send("Registration successfull!")
        }
    } catch (error) {
        console.log(error);
        res.status(402).json({ "error": ["Some error occurred, please try again!"] });
    }

}

const LoginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userFound = await User.findOne({ $or: [{ username: username }, { email: username }] });
        if (userFound) {
            if (await bcrypt.compare(password, userFound.password)) {
                const token = generateToken(userFound._id);
                res
                    .status(200)
                    .cookie("uToken", token,
                        {
                            sameSite: "strict",
                            maxAge: Number(process.env.sessionTimeMS),
                            httpOnly: true,
                        })
                    .send("Login Successfull!")
            }
            else {
                res.status(422).json({ "error": ["Password Incorrect!"] });
            }
        }
        else {
            res.status(422).json({ "error": ["Account doesn't exist!"] });
        }
    } catch (error) {
        res.status(422).json({ error: ["Some error occurred, please try again"] })
    }


}

const accessAccountInfo = asyncHandler(async (req, res) => {
    const userFound = await User.findOne(req.user._id, "-_id -__v -password");
    res.status(200).send(userFound);
})

const validateField = async (req, res) => {
    const { fields } = req.body;
    var queryT = {};
    queryT[fields[0]] = fields[1];
    const fieldExist = await User.findOne(queryT);
    if (fieldExist) {
        res.status(402).json({ "error": ["Field Exists"] })
    }
    else {
        res.status(200).send("Field not present");
    }
}

const searchUsers = asyncHandler(async (req, res) => {
    const searchKeys = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            // { email: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    const users = await User.find(searchKeys).find({ _id: { $ne: req.user._id } }).select("-password");
    res.send(users);
});

const followAccount = asyncHandler(async (req, res) => {
    const { accountId } = req.body;
    const accountFound = await User.findOne({ _id: accountId });
    if (!accountFound) {
        return res.status(400).json({ error: "Account doesn't exist!" });
    }
    if (accountFound.followers.includes(req.user._id)) {
        res.status(400).json({ "error": "Account already followed!" });
    }
    try {
        const accountUpdated = await User.findByIdAndUpdate(accountId, { $push: { followers: req.user._id } }, { new: true });
        const userUpdated = await User.findByIdAndUpdate(req.user._id, { $push: { following: accountId } }, { new: true })
            .populate("following", "-password")
            .populate("followers", "-password");
        return res.status(200).send(userUpdated);
    }
    catch (err) {
        res.status(400).json({ "error": err });
    }
});

const unFollowAccount = asyncHandler(async (req, res) => {
    const { accountId } = req.body;
    const accountFound = await User.findOne({ _id: accountId });
    if (!accountFound) {
        return res.status(400).json({ error: "Account doesn't exist!" });
    }
    if (!accountFound.followers.includes(req.user._id)) {
        res.status(400).json({ "error": "Account already unfollowed!" });
    }
    try {
        const accountUpdated = await User.findByIdAndUpdate(accountId, { $pull: { followers: req.user._id } }, { new: true });
        const userUpdated = await User.findByIdAndUpdate(req.user._id, { $pull: { following: accountId } }, { new: true })
            .populate("following", "-password")
            .populate("followers", "-password");
        return res.status(200).send(userUpdated);
    }
    catch (err) {
        res.status(400).json({ "error": err });
    }
});

const accessAccount = asyncHandler(async (req, res) => {
    const { accountId } = req.body;
    try {
        const accountFound = await User.findById(accountId)
            .populate("following", "-password")
            .populate("followers", "-password");
        if (!accountFound) {
            return res.status(400).json({ "error": "Account Not Found!" });
        }
        return res.status(200).send(accountFound);
    }
    catch (err) {
        return res.status(400).json({ "error": err });
    }
});

module.exports = {
    RegisterUser, LoginUser, searchUsers,
    followAccount, unFollowAccount, accessAccount, accessAccountInfo, validateField
};