import express from "express";
import weatherRoutes from "./routes/weatherRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/v1/weather", weatherRoutes);

export default app;