export const errorMiddleWare = (err, req, res, next) => {
    const message = err.message || "Internal Server error";
    const statusCode = err.statusCode || 500;
    console.log(err);
    return res.status(statusCode).json({ success: false, message });
};
export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
