const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPrivate: { type: Boolean, default: false },
    content: { type: String },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
    isCommunity: { type: Boolean, default: false },
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Communities" }
}, {
    timestampes: true,
});

const post = mongoose.model("Posts", postSchema);

module.exports = post;