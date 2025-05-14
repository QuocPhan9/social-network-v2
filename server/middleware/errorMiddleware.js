//unsupportd endpoints
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

//error middleware
const errorHandler = (error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500).json({ message: error.message || "An known error occuredd" });
};

export { notFound, errorHandler };

