import HttpError from "../models/errorModel.js";

//===== Regisiter User =====//
const registerUser = async (req, res, next) => {
    try {
        res.json("Register User");
    } catch (error) {
        return next(new HttpError(error));
    }
};

//===== Login User =====//
const loginUser = async (req, res, next) => {
    try {
        res.json("Login User");
    } catch (error) {
        return next(new HttpError(error));
    }
};

//===== Get User =====//
const getUser = async (req, res, next) => {
    try {
        res.json("Get User");
    } catch (error) {
        return next(new HttpError(error));
    }
};

//===== Get Users =====//
const getUsers = async (req, res, next) => {
    try {
        res.json("Get User");
    } catch (error) {
        return next(new HttpError(error));
    }
};

//===== Edit User =====//
const editUser = async (req, res, next) => {
    try {
        res.json("Edit User");
    } catch (error) {
        return next(new HttpError(error));
    }
};

//===== Follow/Unfollow User =====//
const followUnfollowUser = async (req, res, next) => {
    try {
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
