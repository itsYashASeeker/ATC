const mongoose = require("mongoose");

const chatMessagesSchema = mongoose.Schema({
    chatId: {type: mongoose.Schema.Types.ObjectId, ref: "Chats"},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: {type: String}
}, {
    timestampes: true,
});

const ChatMessages = mongoose.model("ChatMessages", chatMessagesSchema);

module.exports = ChatMessages;