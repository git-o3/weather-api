import express from "express";
import weatherRoutes from "./routes/weatherRoutes.js";
import { weatherRateLimiter } from "./middleware/rateLimiter.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import morganMiddleware from "./middleware/morganMiddleware.js";


const app = express();

// global middleware
app.use(express.json());

app.use(morganMiddleware)

app.use("/api/v1/weather", weatherRateLimiter, weatherRoutes);
app.get("/api/health", (req, res) => res.status(200).send("OK"));

app.use(globalErrorHandler);

export default app;