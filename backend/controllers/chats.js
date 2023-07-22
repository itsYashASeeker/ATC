const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const Chats = require("../models/Chats");
const ChatMessages = require("../models/ChatMessages");

const accessChat = asyncHandler(async (req, res) => {
    const { userIdRec, chatName } = req.body;
    const isChat = await Chats.find({
        $and: [{ users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userIdRec } } }]
    }).populate("users", "-password").populate("latestMessages");
    if (isChat.length > 0) {
        const chatFound1 = await User.populate(isChat, {
            path: "latestMessages.sender",
            select: "name username email pic"
        });
        res.status(200);
        res.send(chatFound1);
    }
    else {
        const chatData = {
            chatName: chatName,
            isGroup: false,
            users: [req.user._id, userIdRec]
        }
        try {
            const newChat = await Chats.create(chatData)
            const chatFound2 = await Chats.findOne({ _id: { $eq: newChat._id } }).populate("users", "-password");
            res.status(200);
            res.send(chatFound2);
        }
        catch (err) {
            res.status(422);
            res.json([{ "error": err }]);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {

    try {
        await Chats.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password")
            .populate("latestMessages")
            .populate("groupAdmin", "-password")
            .sort({ updatedAt: -1 })
            .then(async (cfound) => {
                cfound = await User.populate(cfound, {
                    path: "latestMessages.sender",
                    select: "name username email pic",
                })
                res.status(200).send(cfound)
            });

    }
    catch (err) {
        res.status(400);
    }

});

const createGroup = asyncHandler(async (req, res) => {
    if (!req.body.grpUsers || !req.body.grpName) {
        return res.status(422).send({ message: "Please fill all the fields!" });
    }
    var grpUsers = JSON.parse(req.body.grpUsers);
    let countUser = 0;
    while (grpUsers.length != countUser) {
        grpUsers[countUser] = await User.findById({ _id: grpUsers[countUser] }).select("_id");
        // grpUsers[countUser] = grpUsers[countUser]._id;
        countUser++;
    }
    let grpName = req.body.grpName;
    let reuserid = await User.findById({ _id: req.user._id }).select("_id");
    grpUsers.push(reuserid);
    console.log(grpName, grpUsers);
    if (grpUsers.length > 2) {
        try {
            const grpCreated = await Chats.create({
                chatName: grpName,
                users: grpUsers,
                isGroup: true,
                groupAdmin: req.user._id
            });
            const grpFound = await Chats.findOne({ _id: grpCreated._id }).populate("users", "-password").populate("groupAdmin", "-password");
            return res.status(200).send(grpFound);
        }
        catch (err) {
            return res.status(422).json({ error: err })
        }
    }
    else {
        return res.status(400).json({ error: "Group must contain more than 2 members!" });
    }
});

const checkGroupExists = asyncHandler(async (grpId) => {
    const gChat = await Chats.findById({ _id: grpId });
    if (gChat.isGroup == false) {
        return false;
    }
    else {
        return true;
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { grpId, grpNewName } = req.body;
    if (checkGroupExists(grpId) == false) {
        return res.status(400).json({ error: "The chat is not group chat!" });
    }
    try {
        const grpChat = await Chats.findByIdAndUpdate(grpId, { chatName: grpNewName }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessages");

        return res.status(200).send(grpChat);
    }
    catch (err) {
        return res.status(400).json({ error: err });
    }

});

const addUserToGrp = asyncHandler(async (req, res) => {
    const { grpId, userId } = req.body;
    if (checkGroupExists(grpId) == false) {
        return res.status(400).json({ error: "The chat is not group chat!" });
    }
    try {
        const grpChat = await Chats.findByIdAndUpdate(grpId, { $push: { "users": userId } }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessages");
        return res.status(200).send(grpChat);
    }
    catch (err) {
        return res.status(400).json({ error: err });
    }
});

const removeUserFromGrp = asyncHandler(async (req, res) => {
    const { grpId, userId } = req.body;
    if (checkGroupExists(grpId) == false) {
        return res.status(400).json({ error: "The chat is not group chat!" });
    }
    try {
        const grpChat = await Chats.findByIdAndUpdate(grpId, { $pull: { "users": userId } }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessages");
        return res.status(200).send(grpChat);
    }
    catch (err) {
        return res.status(400).json({ error: err });
    }
})


module.exports = { accessChat, fetchChats, createGroup, renameGroup, 
    addUserToGrp, removeUserFromGrp };
