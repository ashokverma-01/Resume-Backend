import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import userRoute from "./routes/user.route.js";
import resumeRoute from "./routes/resume.route.js";
import googleAuthRoutes from "./routes/google.route.js";

import "./services/google.service.js";

const app = express();

// ================= MIDDLEWARES =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://resume-admin-alpha.vercel.app",
      "https://av-resume.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔑 PASSPORT (BEFORE ROUTES)
app.use(passport.initialize());

// ================= ROUTES =================
app.use("/api/user", userRoute);
app.use("/api/resume", resumeRoute);
app.use("/api/auth", googleAuthRoutes);

export default app;
