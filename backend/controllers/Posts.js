const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const Posts = require("../models/Posts");

const createPosts = asyncHandler(async (req, res) => {
    const { content, isPrivate } = req.body;
    if (!content) {
        return res.status(402).json({ error: "Please fill the content!" });
    }
    try {
        const createdPost = await Posts.create({
            author: req.user._id,
            isPrivate,
            content,
        });
        const postFound = await Posts.findOne({ _id: createdPost._id })
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password");

        res.status(200).send(postFound);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
});

const editPosts = asyncHandler(async (req, res) => {
    const { postID, content, isPrivate } = req.body;
    const pExist = await Posts.findById({ _id: postID });
    if (!pExist) {
        return res.status(400).json({ error: "Post doesn't exist!" });
    }
    if (!content) {
        return res.status(402).json({ error: "Please fill the content!" });
    }
    try {
        const postFound = await Posts.findByIdAndUpdate(
            postID,
            { content: content, isPrivate: isPrivate },
            { new: true }
        )
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password");

        return res.status(200).send(postFound);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
});

const likePosts = asyncHandler(async (req, res) => {
    const { postID } = req.body;
    const pExist = await Posts.findById({ _id: postID });
    if (!pExist) {
        return res.status(402).json({ error: "Post doesn't exist!" });
    }
    try {
        if (pExist.likes.includes(req.user._id)) {
            return res.status(402).json({ error: "You have already liked" });
        }
        const postFound = await Posts.findByIdAndUpdate(
            postID,
            { $push: { likes: req.user._id } },
            { new: true }
        )
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password");

        return res.status(200).send(postFound);
    }
    catch (err) {
        console.log(err);
        return res.status(402).json({ error: err });
    }
});

const dislikePosts = asyncHandler(async (req, res) => {
    const { postID } = req.body;
    const pExist = await Posts.findById({ _id: postID });
    if (!pExist) {
        return res.status(400).json({ error: "Post doesn't exist!" });
    }
    try {
        const postFound = await Posts.findByIdAndUpdate(
            postID,
            { $pull: { likes: req.user._id } },
            { new: true }
        )
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password");

        return res.status(200).send(postFound);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
});

const fetchPosts = async (req, res) => {
    try {
        await Posts.find()
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password")
            .sort({ updatedAt: -1 })
            .then(async (fposts) => {
                fposts = await User.populate(fposts, {
                    path: "communityId.admins",
                    select: "name username profile_pic"
                })
                fposts = await User.populate(fposts, {
                    path: "communityId.users",
                    select: "name username profile_pic"
                });
                res.status(200).send(fposts);
            })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ "error": ["Some error occurred in fetching posts"] });
    }
}


module.exports = { createPosts, editPosts, likePosts, dislikePosts, fetchPosts };
