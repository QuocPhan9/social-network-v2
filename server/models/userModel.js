import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        fullname: {
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
            default: "https://res.cloudinary.com/dasnkizyz/image/upload/v1747207501/none-profile_m2qo6t.jpg",
        },
        bio: {
            type: String,
            default: "No bio yet",
        },
        followers: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        following: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        bookmarks: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

export default model("User", userSchema);
