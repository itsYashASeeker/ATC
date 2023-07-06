const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
    commentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, {
    timestampes: true,
});

const comments = mongoose.model("Comments", commentsSchema);

module.exports = comments;