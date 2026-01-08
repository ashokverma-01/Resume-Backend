import express from "express";
import {
  createResume,
  getUserResumes,
  getAllResumes,
  updateResume,
  getResumeById,
  deleteResume,
  getPublicResumeById,
} from "../controllers/resume.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Create Resume → logged-in users
router.post("/create", upload.single("profileImage"), protect, createResume);

router.get("/all", getAllResumes);
// Get all resumes of logged-in user
router.get("/get", protect, getUserResumes);
router.get("/get/:id", protect, getResumeById);
// Update resume → only owner or admin
router.put("/update/:id", upload.single("profileImage"), protect, updateResume);

// Delete resume → only owner or admin
router.delete("/delete/:id", protect, deleteResume);

router.get("/public/:id", getPublicResumeById);

export default router;
