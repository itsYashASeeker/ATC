const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: { type: String },
    email: { unique: true, type: String },
    username: { unique: true, type: String },
    bio: { type: String },
    contact: { type: Number },
    password: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    profile_pic: { type: String, default: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" },
    isAdmin: { default: false, type: Boolean },
    communities: { type: mongoose.Schema.Types.ObjectId, ref: "Communities" }
}, {
    timestampes: true,
});

// userSchema.pre("save", async function(next){
//     if(!this.modified){
//         next()
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// })

const user = mongoose.model("User", userSchema);

module.exports = user;