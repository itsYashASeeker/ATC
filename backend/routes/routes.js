const express = require("express");

const router = express.Router();
const { RegisterUser, LoginUser, searchUsers, 
    followAccount, unFollowAccount, accessAccount, 
    accessAccountInfo } = require("../controllers/userControl");
const authorize = require("../middleware/authorize");
const { accessChat, fetchChats, createGroup, renameGroup, 
    addUserToGrp, removeUserFromGrp } = require("../controllers/chats.js");
const { createPosts, editPosts, likePosts, 
    dislikePosts, fetchPosts } = require("../controllers/Posts");
const { commentOnPosts, likeOnComment, dislikeOnComment } = require("../controllers/comments.js")
const { fetchCommunity, fetchCommPosts, createCommunity, 
    addUserToCommunity, joinCommunity, makeAccAsAdmin,
    removeAdmin, postOnCommunity, editPostsOnCommunity } = require("../controllers/Community");


router.route("/user").get((req, res) => {
    res.send("How's you, USER?");
});

// Authentication
router.route("/register").post(RegisterUser);
router.route("/login").post(LoginUser);
router.route("/search/users").get(authorize, searchUsers);

// Access User info
router.route("/user/access/account").get(authorize, accessAccountInfo);

// Connection
router.route("/follow").post(authorize, followAccount);
router.route("/unfollow").post(authorize, unFollowAccount);
router.route("/access/account").get(authorize, accessAccount);

// Chats
router.route("/user/access/chat").get(authorize, accessChat);
router.route("/user/fetch/chats").get(authorize, fetchChats);
router.route("/group/create").post(authorize, createGroup);
router.route("/group/rename").post(authorize, renameGroup);
router.route("/group/add").post(authorize, addUserToGrp);
router.route("/group/remove").post(authorize, removeUserFromGrp);


// Posts
router.route("/user/fetch/posts").get(authorize, fetchPosts);
router.route("/post/create").post(authorize, createPosts);
router.route("/post/edit").post(authorize, editPosts);
router.route("/post/like").post(authorize, likePosts);
router.route("/post/dislike").post(authorize, dislikePosts);

// comment on post
router.route("/post/comment").post(authorize, commentOnPosts);
router.route("/post/comment/like").post(authorize, likeOnComment);
router.route("/post/comment/dislike").post(authorize, dislikeOnComment);


// Create a community
router.route("/user/fetch/community").get(authorize, fetchCommunity);
router.route("/user/fetch/community/posts").get(authorize, fetchCommPosts);
router.route("/community/create").post(authorize, createCommunity);
router.route("/community/add/users").post(authorize, addUserToCommunity);
router.route("/community/join").post(authorize, joinCommunity);
router.route("/community/make-admin-acc").post(authorize, makeAccAsAdmin);
router.route("/community/remove-admin-acc").post(authorize, removeAdmin);
router.route("/community/post").post(authorize, postOnCommunity);
router.route("/community/post/edit").post(authorize, editPostsOnCommunity);



module.exports = router;