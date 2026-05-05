export const globalErrorHandler = (err, req, res, next) => {
    
    const statusCode = err.response?.status || 500;
    const message = err.response?.data || err.message || "Internal Server Error";

    console.error(`[Error]: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        error: message
    })
}