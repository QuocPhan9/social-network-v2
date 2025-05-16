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
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:id", getUser);
router.get("/users", getUsers);
router.patch("/users/:id", authMiddleware, editUser);
router.get("/users/:id/follow-unfollow", authMiddleware, followUnfollowUser);
router.post("/users/avatar", authMiddleware, changeUserAvatar);

export default router;
