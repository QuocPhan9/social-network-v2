import { Router } from "express";
import { registerUser, loginUser, getUsers, editUser, followUnfollowUser, getUser, changeUserAvatar } from "../controllers/userController.js";

const router = Router();

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:id", getUser);
router.get("/users", getUsers);
router.patch("/users/:id", editUser);
router.get("/users/:id/follow-unfollow", followUnfollowUser);
router.post("/users/avatar", changeUserAvatar);


export default router;