const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateTok");

const RegisterUser = asyncHandler(async (req, res) => {
    // console.log(User);
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
        return res.status(402).json({ error: "Please fill all fields" })
    }
    try {
        const userExists = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (userExists) {
            res.status(422).json({ errors: [{ user: "Account already exists" }] });
            throw new Error("Account already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
        });
        if (newUser) {
            return res.status(200).send({
                "user": {
                    _id: newUser._id,
                    name: newUser.name,
                    username: newUser.username,
                    email: newUser.email,
                    pic: newUser.profile_pic,
                    token: generateToken(newUser._id),
                }
            });
        }
    }
    catch (err) {
        res.status(422).send({ "error": err });
        throw new Error(err);
    }
});

const LoginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const userFound = await User.findOne({ $or: [{ username: username }, { email: username }] });
    if (userFound) {
        if (await bcrypt.compare(password, userFound.password)) {
            res.status(200).send({
                "user": {
                    _id: userFound._id,
                    name: userFound.name,
                    username: userFound.username,
                    email: userFound.email,
                    pic: userFound.profile_pic,
                    token: generateToken(userFound._id),
                }
            }
            );
        }
        else {
            res.status(422).send({ "error": "Password Incorrect!" });
            // throw new Error();
            
        }

    }
    else {
        // console.log("Account doesn't exist!");
        res.status(422).send({ "error": "Account doesn't exist!" });
    }

});

const accessAccountInfo = asyncHandler(async (req, res) => {
    const userFound = await User.findById(req.user._id);
    res.status(200).send({
        "user": userFound
    });
})

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
    followAccount, unFollowAccount, accessAccount, accessAccountInfo
};