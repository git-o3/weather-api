import morgan from "morgan";
import logger from "../utils/logger.js";

// a stream object with a "write" function that will be used by morgan
const stream = {
    write: (message) => logger.info(message.trim()),
};

// "dev" formart in development and "combined" (standard) in production
const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms",
    { stream }
);

export default morganMiddleware;