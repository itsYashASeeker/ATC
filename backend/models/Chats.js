const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    chatName: { type: String },
    isGroup: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatMessages" }],
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
    timestampes: true,
});

const Chats = mongoose.model("Chats", chatSchema);

module.exports = Chats;