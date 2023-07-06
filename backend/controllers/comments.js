const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const Posts = require("../models/Posts");
const Comments = require("../models/Comments");

const commentOnPosts = asyncHandler(async(req,res)=>{
    const {postID, content} = req.body;
    const pExist = await Posts.findById({ _id: postID });
    if (!pExist) {
        return res.status(400).json({ error: "Post doesn't exist!" });
    }
    if (!content) {
        return res.status(402).json({ error: "Please fill the content!" });
    }
    try{
        const createComment = await Comments.create({
            postId: postID,
            commentorId: req.user._id,
            content
        });
        const postFound = await Posts.findByIdAndUpdate(postID, { $push: { comments: createComment._id } }, { new: true })
            .populate("author", "-password")
            .populate("likes", "-password")
            .populate("comments", "-password")

        return res.status(200).send(postFound);
    }
    catch(err){
        return res.status(400).json({error: err});
    }
});

const likeOnComment = asyncHandler(async(req,res)=>{
    const { commentID } = req.body;
    const cExist = await Comments.findById({ _id: commentID });
    if (!cExist) {
        return res.status(400).json({ error: "Comment doesn't exist!" });
    }
    try {
        if (cExist.likes.includes(req.user._id)) {
            return res.status(400).json({ error: "You have already liked" });
        }
        const commentFound = await Comments.findByIdAndUpdate(
            commentID,
            { $push: { likes: req.user._id } },
            { new: true }
        )

        return res.status(200).send(commentFound);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
});

const dislikeOnComment = asyncHandler(async (req, res) => {
    const { commentID } = req.body;
    const cExist = await Comments.findById({ _id: commentID });
    if (!cExist) {
        return res.status(400).json({ error: "Comment doesn't exist!" });
    }
    try {
        const commentFound = await Comments.findByIdAndUpdate(
            commentID,
            { $pull: { likes: req.user._id } },
            { new: true }
        )

        return res.status(200).send(commentFound);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
    }
});


module.exports = { commentOnPosts, likeOnComment, dislikeOnComment }