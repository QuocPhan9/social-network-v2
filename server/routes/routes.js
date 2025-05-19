import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUsers,
    editUser,
    followUnfollowUser,
    getUser,
    changeUserAvatar,
} from "../controllers/userController.js";
import {
    createPost,
    getPost,
    getPosts,
    updatePost,
    deletePost,
    getFollowingPosts,
    likeDislikePost,
    getUserPosts,
    createBookmark,
    getUserBookmarks,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

//===== User Routes =====//

//POST
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.post("/users/avatar", authMiddleware, changeUserAvatar);

//GET
router.get("/users/bookmarks", authMiddleware, getUserBookmarks);
router.get("/users/:id", authMiddleware, getUser);
router.get("/users", authMiddleware, getUsers);
router.get("/users/:id/posts", authMiddleware, getUserPosts);
router.get("/users/:id/follow-unfollow", authMiddleware, followUnfollowUser);

//PATCH
router.patch("/users/:id", authMiddleware, editUser);

//===== Post Routes =====//

//POST
router.post("/posts", createPost);

//GET
router.get("/posts/:id", getPost);
router.get("/posts", getPosts);
router.get("/posts/:id/like", likeDislikePost);
router.get("/posts/follwings", getFollowingPosts);
router.get("/posts/:id/bookmark", createBookmark);

//PATCH
router.patch("/posts/:id", updatePost);

//DELETE
router.delete("/posts/:id", deletePost);

export default router;
