import { commentModel, postModel, userModel, HttpError } from "../models/index.js";

//  =========================== Create Comment ===========================
const createComment = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;

        if (!comment || comment.trim() === "") {
            return next(new HttpError("Comment cannot be empty", 422));
        }

        const post = await postModel.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        const commentCreator = await userModel.findById(req.user.id);
        if (!commentCreator) {
            return next(new HttpError("User not found", 404));
        }

        const newComment = await commentModel.create({
            creator: {
                creatorId: req.user.id,
                creatorName: commentCreator?.fullName,
                creatorPhoto: commentCreator?.profilePhoto,
            },
            comment,
            postId,
        });

        await postModel.findByIdAndUpdate(postId, { $push: { comments: newComment._id } }, { new: true });

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        return next(new HttpError("Internal Server Error", 500));
    }
};

//  =========================== Get Post Comments ===========================
const getPostComments = async (req, res, next) => {
    try {
        const { postId } = req.params;

        const post = await postModel.findById(postId).populate({
            path: "comments",
            options: { sort: { createdAt: -1 } },
        });

        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        return next(new HttpError("Internal Server Error", 500));
    }
};

//  =========================== Delete Comments ===========================
const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return next(new HttpError("Comment not found", 404));
        }

        // Kiểm tra quyền xóa (chỉ người tạo comment mới được xóa)
        if (comment.creator.creatorId.toString() !== req.user.id) {
            return next(new HttpError("Not authorized to delete this comment", 403));
        }

        // Xóa comment khỏi post
        await postModel.findByIdAndUpdate(
            comment.postId,
            { $pull: { comments: commentId } },
            { new: true }
        );

        // Xóa comment khỏi database
        await commentModel.findByIdAndDelete(commentId);

        res.status(200).json({ message: "Comment deleted successfully", commentId });
    } catch (error) {
        console.error(error);
        return next(new HttpError("Internal Server Error", 500));
    }
};

export { createComment, getPostComments, deleteComment };
