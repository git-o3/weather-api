export const globalErrorHandler = (err, req, res, next) => {
    
    const statusCode = err.response?.status || 500;
    const message = err.response?.data || err.message || "Internal Server Error";

    // log the full error stack for debugging
    logger.error(`status: ${statusCode} - Error: ${message}`, {
        url: req.originalUrl,
        method: req.method,
        stack: err.stack
    });

    res.status(statusCode).json({
        success: false,
        error: message
    });
};