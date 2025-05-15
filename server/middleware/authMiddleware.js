import jwt from "jsonwebtoken";
import HttpError from "../models/errorModel.js";

const authMiddleware = async (req, res, next) => {
    const Auhorization = req.headers.Authorization || req.headers.authorization;

    if (Auhorization && Auhorization.startsWith("Bearer")) {
        const token = Auhorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if (err) {
                return next(new HttpError("Unauthorized. Invalid token", 403));
            }

            req.user = info;
            next();
        });
    } else {
        return next(new HttpError("Unauthorized. No token", 401));
    }
};

export default authMiddleware;
