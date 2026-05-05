import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYY-MM-DD HH:mm:ss"}),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: "weather-api" } ,
    transports: [
       // write all logs with importance leve; of "error" or less to "error.log"
       new transports.File({ filename: "logs/error.log", level: "error"}),
       // all logs with importance leve; of "info" or less to `combined.log`
       new transports.File({ filename: "logs/combined.log" }),
    ],
});

// if not production then log to the `console` with coloers
if (process.env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }))
}

export default logger;