import { v4 as uuid } from "uuid";

import { userModel, postModel, HttpError } from "../models/index.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

//===== Creat Post =====//
const createPost = async (req, res, next) => {
    try {
        res.json("Create Post");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Post =====//
const getPost = async (req, res, next) => {
    try {
        res.json("Get Post");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Posts =====//
const getPosts = async (req, res, next) => {
    try {
        res.json("Get Posts");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Update Post =====//
const updatePost = async (req, res, next) => {
    try {
        res.json("Update Post");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Delete Post =====//
const deletePost = async (req, res, next) => {
    try {
        res.json("Delete Post");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Following Posts =====//
const getFollowingPosts = async (req, res, next) => {
    try {
        res.json("Get Following Posts");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Like/Dislike Posts =====//
const likeDislikePost = async (req, res, next) => {
    try {
        res.json("Like/Dislike a post");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get User Posts =====//
const getUserPosts = async (req, res, next) => {
    try {
        res.json("Get User Post");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Create Bookmark =====//
const createBookmark = async (req, res, next) => {
    try {
        res.json("Create Bookmark");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Bookmarks =====//
const getUserBookmarks = async (req, res, next) => {
    try {
        res.json("Get User Bookmarks");
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

export {
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
};
