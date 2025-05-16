import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePhoto: {
            type: String,
            default: "https://res.cloudinary.com/dkd0o04li/image/upload/v1747382350/SOCIALMEDIA/AvatarIMG/o26xm3brvyqeupz6zz95.jpg",
        },
        bio: {
            type: String,
            default: "No bio yet",
        },
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
    },
    { timestamps: true },
);

export default model("User", userSchema);
