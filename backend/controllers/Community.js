const Communities = require("../models/Communities");
const asyncHandler = require("express-async-handler");
const Posts = require("../models/Posts");

const fetchCommunity = asyncHandler(async (req, res) => {
    const { commId } = req.body;
    if (!commId) {
        return res.status(400).json({ "error": "Please provide community id!" });
    }
    try {
        const commData = await Communities.findById(commId)
            .populate("members", "-password")
            .populate("admins", "-password");
        if (!commData) {
            return res.status(400).json({ "error": "Community doesn't exist!" });
        }
        return res.status(200).send(commData);
    }
    catch (err) {
        return res.status(400).json({ "error": err });
    }
});

const fetchCommPosts = asyncHandler(async (req, res) => {
    const { commId } = req.body;
    if (!commId) {
        return res.status(400).json({ "error": "Please provide community id!" });
    }
    try {
        const commPostsData = await Posts.find({ isCommunity: { $eq: true }, communityId: { $elemMatch: { $eq: commId } } })
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password");
        if (!commPostsData) {
            return res.status(400).json({ "error": "Community doesn't exist!" });
        }
        return res.status(200).send(commPostsData);
    }
    catch (err) {
        return res.status(400).json({ "error": err });
    }
});

const createCommunity = asyncHandler(async (req, res) => {
    const { name, bio, purpose } = req.body;

    if (!name || !bio || !purpose) {
        res.status(402).json({ "error": "Please fill all contents!" });
    }
    try {
        const communityCreated = await Communities.create({
            name,
            bio,
            purpose,
        });

        await Communities.updateOne({ _id: communityCreated._id },
            { $push: { "admins": req.user._id, "members": req.user._id }, "creatorAdmin": req.user._id });

        const commuFound = await Communities.findById(communityCreated)
            .populate("admins", "-password")
            .populate("members", "-password");

        res.status(200).send(commuFound);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
});

const joinCommunity = asyncHandler(async (req, res) => {
    const { commId } = req.body;
    if (!commId) {
        return res.status(400).json({ "error": "Please provide valid community!" });
    }
    const commFound = await Communities.findById(commId);
    if (commFound.members.includes(req.user._id)) {
        return res.status(400).json({ "error": "You have already joined the community!" });
    }
    try {
        const joinedComm = await Communities.findByIdAndUpdate(commId, { $push: { "members": req.user._id } }, { new: true })
            .populate("admins", "-password")
            .populate("members", "-password");
        return res.status(200).send(joinedComm);
    }
    catch (err) {
        return res.status(400).json({ "error": err });
    }
})

const addUserToCommunity = asyncHandler(async (req, res) => {
    const { accountId, commId } = req.body;
    const commData = await Communities.findById(commId);
    if (!commData.admins.includes(req.user._id)) {
        return res.status(400).json({ "error": "Sorry you are not admin!" });
    }
    try {
        const commFound = await Communities.findByIdAndUpdate(commId, { $push: { "members": accountId } }, { new: true })
            .populate("members", "-password")
            .populate("admins", "-password");

        return res.status(200).send(commFound);
    }
    catch (err) {
        return res.status(400).json({ "error": err });
    }

});

const makeAccAsAdmin = asyncHandler(async (req, res) => {
    const { accountId, commId } = req.body;
    const commData = await Communities.findById(commId);
    if (!commData.admins.includes(req.user._id)) {
        return res.status(400).json({ "error": "Sorry you are not admin!" });
    }
    try {
        const commFound = await Communities.findByIdAndUpdate(commId, { $push: { "admins": accountId } }, { new: true })
            .populate("members", "-password")
            .populate("admins", "-password");

        return res.status(200).send(commFound);
    }
    catch (err) {
        return res.status(400).json({ "error": err });
    }

});

const removeAdmin = asyncHandler(async (req, res) => {
    const { accountId, commId } = req.body;
    if (!accountId || !commId) {
        return res.status(400).json({ "error": "Please provide valid details!" });
    }
    try {
        const commData = await Communities.findById(commId);
        if (!commData.admins.includes(req.user._id)) {
            return res.status(400).json({ "error": "Sorry, you are not admin!" });
        }
        if (commData.admins.length < 2) {
            return res.status(400).json({ "error": "Admin can't be removed, since only one admin exists!" });
        }
        const adminRemovedComm = await Communities.findByIdAndUpdate(commId, { $pull: { "admins": accountId } }, { new: true })
            .populate("members", "-password")
            .populate("admins", "-password");

        return res.status(200).send(adminRemovedComm);

    } catch (err) {
        return res.status(400).json({ "error": err });
    }
});

const postOnCommunity = asyncHandler(async (req, res) => {
    const { commId, content } = req.body;
    if (!commId) {
        return res.status(400).json({ "error": "Please provide valid details!" });
    }
    try {
        const commData = await Communities.findById(commId);
        if (!commData.admins.includes(req.user._id)) {
            return res.status(400).json({ "error": "Sorry, you are not admin!" });
        }
        const createdPost = await Posts.create({
            author: req.user._id,
            isPrivate: false,
            content,
            isCommunity: true,
            communityId: commId
        });
        const postFoundComm = await Posts.findOne({ _id: createdPost._id })
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password")
            .populate("communityId");

        return res.status(200).send(postFoundComm);

    } catch (err) {
        return res.status(400).json({ "error": err });
    }
});

const editPostsOnCommunity = asyncHandler(async (req, res) => {
    const { postID, content } = req.body;
    const pExist = await Posts.findById({ _id: postID });
    if (!pExist) {
        return res.status(400).json({ error: "Post doesn't exist!" });
    }
    if (!content) {
        return res.status(402).json({ error: "Please fill the content!" });
    }
    try {
        const commData = await Communities.findById(pExist.communityId);
        if (!commData.admins.includes(req.user._id)) {
            return res.status(400).json({ "error": "Sorry, you are not admin!" });
        }
        const postFound = await Posts.findByIdAndUpdate(
            postID,
            { content },
            { new: true }
        )
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password")
            .populate("communityId");

        return res.status(200).send(postFound);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
});

module.exports = {
    fetchCommunity, fetchCommPosts, createCommunity,
    addUserToCommunity, joinCommunity, makeAccAsAdmin, removeAdmin, postOnCommunity,
    editPostsOnCommunity
};