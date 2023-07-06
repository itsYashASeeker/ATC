const mongoose = require("mongoose");

const communitySchema = mongoose.Schema({
    name: {type: String},
    bio: {type: String},
    purpose: {type: String},
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    creatorAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
    timestampes: true,
});

const communities = mongoose.model("Communities", communitySchema);

module.exports = communities;