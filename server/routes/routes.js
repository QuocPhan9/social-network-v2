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

//=============== User Routes ===============//

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

//=============== Post Routes ===============//

//POST
router.post("/posts",authMiddleware, createPost);

//GET
router.get("/posts/:id", authMiddleware, getPost);
router.get("/posts", authMiddleware, getPosts);
router.get("/posts/:id/like", authMiddleware, likeDislikePost);
router.get("/posts/follwing", authMiddleware, getFollowingPosts);
router.get("/posts/:id/bookmark", authMiddleware, createBookmark);

//PATCH
router.patch("/posts/:id", authMiddleware, updatePost);

//DELETE
router.delete("/posts/:id", authMiddleware, deletePost);
 
export default router;
