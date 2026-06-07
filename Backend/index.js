import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/authRoutes.js";
import taskRoutes from "./src/routes/TaskRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

dotenv.config();

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Basic security headers
app.use(helmet());

// Simple request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate limiting to reduce brute-force and DoS risks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-management-git-main-shiva132007s-projects.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3000;

connectDB();

app.use("/api/auth", routes);
app.use("/api", taskRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler and error middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
