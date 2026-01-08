import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
  getAllUsers,
  updateUserRole,
} from "../controllers/user.controller.js";
import { protect, adminOnly } from "../middlewares/auth.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/all", getAllUsers);
router.put("/update/:id", upload.single("profileImage"), protect, updateUser);
router.put("/role/:id", protect, adminOnly, updateUserRole);
router.delete("/delete/:id", deleteUser);

export default router;
