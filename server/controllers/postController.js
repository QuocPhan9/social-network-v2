import { v4 as uuid } from "uuid";

import { userModel, postModel, HttpError } from "../models/index.js";
import cloudinary from "../utils/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

//===== Creat Post =====//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const createPost = async (req, res, next) => {
    try {
        const { body } = req.body;
        const image = req.files?.image;

        if (!body || !image) {
            return next(new HttpError("Please fill in the text field and choose an image", 422));
        }

        const fileExt = path.extname(image.name);
        const fileName = `${path.basename(image.name, fileExt)}_${uuid()}${fileExt}`;
        const uploadPath = path.join(__dirname, "..", "uploads", fileName);

        await promisify(image.mv)(uploadPath);

        const result = await cloudinary.uploader.upload(uploadPath, {
            folder: "SOCIALMEDIA/PostsIMG",
            resource_type: "image",
        });

        if (!result.secure_url) {
            return next(new HttpError("Image upload failed", 500));
        }

        // Create new post
        const newPost = new postModel({
            creator: req.user.id,
            body,
            image: result.secure_url,
        });

        await newPost.save();

        await userModel.findByIdAndUpdate(req.user.id, {
            $push: { posts: newPost._id },
        });

        res.status(201).json(newPost);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Post =====//
const getPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await postModel
            .findById(id)
            .populate("creator")
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
            });

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Posts =====//
const getPosts = async (req, res, next) => {
    try {
        const posts = await postModel.find().sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Update Post =====//
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { body } = req.body;

        const post = await postModel.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        if (post?.creator.toString() !== req.user.id) {
            return next(new HttpError("You are not authorized to update this post", 403));
        }

        post.body = body || post.body;

        await post.save();

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Delete Post =====//
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const post = await postModel.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }
        if (post.creator.toString() !== req.user.id) {
            return next(new HttpError("You are not authorized to delete this post", 403));
        }

        await post.deleteOne();

        await userModel.findByIdAndUpdate(post.creator, {
            $pull: { posts: post._id },
        });

        res.status(200).json({ message: "Post deleted successfully", postId });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Following Posts =====//
const getFollowingPosts = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);
        const posts = await postModel.find({ creator: { $in: user?.following } });

        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Like/Dislike Posts =====//
const likeDislikePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await postModel.findById(id);
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        const isLiked = post.likes.includes(userId);
        const updateOperation = isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } };

        const updatedPost = await postModel.findByIdAndUpdate(id, updateOperation, { new: true });

        res.status(200).json({
            message: isLiked ? "Post unliked" : "Post liked",
            post: updatedPost,
        });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get User Posts =====//
const getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await userModel.findById(userId).populate({
            path: "posts",
            options: { sort: { createdAt: -1 } },
        });

        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        res.status(200).json({
            message: "Get user posts successfully",
            posts: user.posts,
        });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};
//===== Create Bookmark =====//
const createBookmark = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        const isBookmarked = user.bookmarks.includes(id);
        const update = isBookmarked ? { $pull: { bookmarks: id } } : { $push: { bookmarks: id } };

        const updatedUser = await userModel.findByIdAndUpdate(userId, update, { new: true });

        res.status(200).json({
            message: isBookmarked ? "Bookmark removed" : "Bookmark added",
            bookmarks: updatedUser.bookmarks,
        });
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

//===== Get Bookmarks =====//
const getUserBookmarks = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId).populate({
            path: "bookmarks",
            options: { sort: { createdAt: -1 } },
        });

        if (!user) {
            return next(new HttpError("User not found", 404));
        }

        res.status(200).json({
            message: "Get user bookmarks successfully",
            bookmarks: user.bookmarks,
        });
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
