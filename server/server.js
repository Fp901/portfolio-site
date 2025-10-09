// server/server.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import contactRoutes from "./routes/contactRoutes.js";

// ===================================
// 🔹 Load environment variables
// ===================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log(
  "SENDGRID_API_KEY prefix in backend:",
  process.env.SENDGRID_API_KEY?.substring(0, 5)
);

// Debug — confirm SendGrid key loaded
if (!process.env.SENDGRID_API_KEY) {
  console.warn("⚠️  SENDGRID_API_KEY missing or not loaded from .env");
} else {
  console.log(
    "✅ Loaded SENDGRID_API_KEY prefix:",
    process.env.SENDGRID_API_KEY.substring(0, 5)
  );
}

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// 🛡️ Security + Middleware
// ===================================

// Secure headers
app.use(helmet());

// Allow only your development origins
const allowedOrigins = (
  process.env.CORS_ORIGINS || "http://127.0.0.1:5500,http://localhost:5500"
)
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Rate limiting to protect backend
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Small request logger (development only)
app.use((req, _res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  next();
});

// ===================================
// 📨 Routes
// ===================================
app.use("/api", contactRoutes);

// Health check route
app.get("/", (_req, res) => {
  res.send("✅ Portfolio backend is running...");
});

// ===================================
// 🚀 Start the Server
// ===================================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
