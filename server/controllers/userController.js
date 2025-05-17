import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import UserModel from "../models/userModel.js";
import HttpError from "../models/errorModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../utils/cloudinary.js";

//===== Regisiter User =====//
const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        if (!fullName || !email || !password || !confirmPassword) {
            return next(new HttpError("Please fill all fields", 422));
        }

        //make the email lowercased
        const lowerCasedEmail = email.toLowerCase();

        //Check DB if email already exists
        const emailExists = await UserModel.findOne({ email: lowerCasedEmail });
        if (emailExists) {
            return next(new HttpError("Email already exists", 422));
        }

        //Check if password and confirm password are same
        if (password !== confirmPassword) {
            return next(new HttpError("Passwords are not match"), 422);
        }

        //Check password legnth
        if (password < 6) {
            return next(new HttpError("Password must be at least 6 characters", 422));
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //add user to DB
        const newUser = await UserModel.create({
            fullName,
            email: lowerCasedEmail,
            password: hashedPassword,
        });

        res.status(201).json(newUser);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Login User =====//
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Please fill all fields", 422));
        }

        //make the email lowercased
        const lowerCasedEmail = email.toLowerCase();

        //fetch user from DB
        const user = await UserModel.findOne({ email: lowerCasedEmail });
        if (!user) {
            return next(new HttpError("User not found", 422));
        }

        //copmare passwords
        const isComparePassword = await bcrypt.compare(password, user?.password);
        if (!isComparePassword) {
            return next(new HttpError("Invalid Credential", 422));
        }

        const token = jwt.sign(
            {
                id: user?._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            },
        );

        res.status(200).json({ token, id: user?._id });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get User =====//
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        res.status(201).json({
            success: true,
            message: "Get User Successfully",
            user,
        });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Users =====//
const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().limit(10).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Get Users Successfully",
            user: users,
        });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Edit User =====//
const editUser = async (req, res, next) => {
    try {
        const { fullName, bio } = req.body;
        const editedUser = await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                fullName,
                bio,
            },
            { new: true },
        );

        res.status(200).json({
            success: true,
            message: "User Edited Successfully",
            user: editedUser,
        });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Follow/Unfollow User =====//
const followUnfollowUser = async (req, res, next) => {
    try {
        const userToFollowId = req.params.id;
        const targetUserId = req.user.id;
        if (targetUserId === userToFollowId) {
            return next(new HttpError("You can't follow/unfollow yourself", 422));
        }

        const currentUser = await UserModel.findById(targetUserId);
        const isFollowing = currentUser?.following?.includes(userToFollowId);

        //follow if not following, else unfollow is already folowing
        if (!isFollowing) {
            //Follow
            await UserModel.findByIdAndUpdate(
                targetUserId,
                { $addToSet: { following: userToFollowId } },
                { new: true },
            );

            const updatedUser = await UserModel.findByIdAndUpdate(
                userToFollowId,
                { $addToSet: { followers: targetUserId } },
                { new: true },
            );

            res.status(200).json({
                success: true,
                message: "User followed Successfully",
                user: updatedUser,
            });
        } else {
            //Unfollow
            await UserModel.findByIdAndUpdate(targetUserId, { $pull: { following: userToFollowId } }, { new: true });

            const updatedUser = await UserModel.findByIdAndUpdate(
                userToFollowId,
                { $pull: { followers: targetUserId } },
                { new: true },
            );

            res.status(200).json({
                success: true,
                message: "User unfollowed Successfully",
                user: updatedUser,
            });
        }
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Change User Profile Photo =====//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const changeUserAvatar = async (req, res, next) => {
    try {
        if (!req.files?.avatar) {
            return next(new HttpError("Please choose an image", 422));
        }

        const { avatar } = req.files;
        if (avatar.size > 500000) {
            return next(new HttpError("File size is too large. Should be less than 500kb", 422));
        }

        const fileNameParts = avatar.name.split(".");
        const newFileName = fileNameParts[0] + uuid() + "." + fileNameParts.pop();
        const filePath = path.join(__dirname, "..", "uploads", newFileName);

        avatar.mv(filePath, async (err) => {
            if (err) return next(new HttpError("File upload failed", 422));

            try {
                const result = await cloudinary.uploader.upload(filePath, {
                    resource_type: "image",
                    folder: "SOCIALMEDIA/AvatarIMG",
                });

                if (!result.secure_url) {
                    return next(new HttpError("Couldn't upload image to Cloudinary", 422));
                }

                const updatedUser = await UserModel.findByIdAndUpdate(
                    req.user.id,
                    { $set: { profilePhoto: result.secure_url } },
                    { new: true },
                );

                if (!updatedUser) {
                    return next(new HttpError("User not found or update failed", 404));
                }

                res.status(200).json({
                    success: true,
                    message: "User avatar changed successfully",
                    user: updatedUser,
                });
            } catch (cloudErr) {
                return next(new HttpError(cloudErr.message || "Cloudinary error", 500));
            }
        });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

export { registerUser, loginUser, getUser, getUsers, editUser, followUnfollowUser, changeUserAvatar };
