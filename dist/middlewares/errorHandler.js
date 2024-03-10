export const errorMiddleWare = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (err.name === "CastError") {
        err.message = "Invalid Id";
    }
    const message = err.message || "Internal Server error";
    console.log(err);
    return res.status(statusCode).json({ success: false, message });
};
export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
