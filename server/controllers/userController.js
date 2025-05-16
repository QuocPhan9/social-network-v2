import HttpError from "../models/errorModel.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
        return next(new HttpError(error));
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
        return next(new HttpError(error));
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

        res.status(201).json(user);
    } catch (error) {
        return next(new HttpError(error));
    }
};

//===== Get Users =====//
const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().limit(10).sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        return next(new HttpError(error));
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

        res.status(200).json(editedUser);
    } catch (error) {
        return next(new HttpError(error));
    }
};

//===== Follow/Unfollow User =====//
const followUnfollowUser = async (req, res, next) => {
    try {
        const userToFollowId = req.params.id;
        if (req.user.id === userToFollowId) {
            return next(new HttpError("You can't follow/unfollow yourself", 422));
        }

        const currentUser = await UserModel.findById(req.user.id);
        const isFollowing = currentUser?.following?.includes(userToFollowId);

        //follow if not following, else unfollow is already folowing
        if (!isFollowing) {
            const updatedUser = await UserModel.findByIdAndUpdate(userToFollowId, {$push: {followers: req.user.id}}, {new: true});
        }
        res.json("Follow/Unfollow User");
    } catch (error) {
        return next(new HttpError(error));
    }
};

//===== Change User Profile Photo =====//
const changeUserAvatar = async (req, res, next) => {
    try {
        res.json("Change User Avatar");
    } catch (error) {
        return next(new HttpError(error));
    }
};

export { registerUser, loginUser, getUser, getUsers, editUser, followUnfollowUser, changeUserAvatar };
