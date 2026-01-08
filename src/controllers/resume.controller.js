import Resume from "../models/resume.model.js";
import { deleteCloudinaryImage } from "../services/cloudinary.service.js";

// Create Resume
// Helper to convert any format to YYYY-MM
const toMonthString = (date) => {
  if (!date) return "";

  if (typeof date === "number") {
    return `${date}-01`; // 2021 → 2021-01
  }

  if (typeof date === "string") {
    const d = new Date(date);
    if (!isNaN(d)) {
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${year}-${month}`;
    }

    if (/^\d{4}-\d{2}$/.test(date)) return date; // already YYYY-MM
    return ""; // fallback
  }

  return "";
};

// Safe JSON parser for arrays
const parseJSONField = (field) => {
  if (!field) return [];
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  }
  return Array.isArray(field) ? field : [];
};

export const createResume = async (req, res) => {
  try {
    const {
      fullName,
      title,
      email,
      phone,
      address,
      linkedin,
      website,
      summary,
      education,
      experience,
      projects,
      skills,
      languages,
    } = req.body;

    // ---------- Parse and normalize arrays ----------
    const educationArr = parseJSONField(education).map((edu) => ({
      ...edu,
      startDate: toMonthString(edu.startDate),
      endDate: toMonthString(edu.endDate),
    }));

    const experienceArr = parseJSONField(experience).map((exp) => ({
      ...exp,
      startDate: toMonthString(exp.startDate),
      endDate: toMonthString(exp.endDate),
    }));

    const projectsArr = parseJSONField(projects);
    const skillsArr = parseJSONField(skills);
    const languagesArr = parseJSONField(languages);

    // ---------- Profile Image ----------
    const profileImage = req.file
      ? { url: req.file.path, public_id: req.file.filename }
      : { url: "", public_id: "" };

    // ---------- Create Resume ----------
    const resume = await Resume.create({
      user: req.user._id,
      fullName,
      title,
      email,
      phone,
      address,
      linkedin,
      website,
      summary,
      education: educationArr,
      experience: experienceArr,
      projects: projectsArr,
      skills: skillsArr,
      languages: languagesArr,
      profileImage,
    });

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Resumes of Logged-in User
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find()
      .select("fullName title email phone skills education createdAt")

      .select("name email phone skills education createdAt"); // select only needed fields

    res.json({ success: true, resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params; // match the route
    const resume = await Resume.findById(id);
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Resume

// Helper to convert date strings to year number if needed
const normalizeEducationDates = (educationArray) => {
  return (educationArray || []).map((edu) => ({
    ...edu,
    startDate: toMonthString(edu.startDate),
    endDate: toMonthString(edu.endDate),
  }));
};

const normalizeExperienceDates = (experienceArray) => {
  return (experienceArray || []).map((exp) => ({
    ...exp,
    startDate: toMonthString(exp.startDate),
    endDate: toMonthString(exp.endDate),
  }));
};

export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find resume
    const resume = await Resume.findById(id);
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    // 2️⃣ Authorization
    if (
      resume.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this resume",
      });
    }

    // 3️⃣ Parse JSON fields safely
    let education = parseJSONField(req.body.education) || resume.education;
    let experience = parseJSONField(req.body.experience) || resume.experience;
    let projects = parseJSONField(req.body.projects) || resume.projects;
    let skills = parseJSONField(req.body.skills) || resume.skills;
    let languages = parseJSONField(req.body.languages) || resume.languages;

    // 4️⃣ Normalize education dates
    education = normalizeEducationDates(education);
    experience = normalizeExperienceDates(experience);

    // 5️⃣ Update normal fields
    resume.fullName = req.body.fullName ?? resume.fullName;
    resume.title = req.body.title ?? resume.title;
    resume.email = req.body.email ?? resume.email;
    resume.phone = req.body.phone ?? resume.phone;
    resume.address = req.body.address ?? resume.address;
    resume.linkedin = req.body.linkedin ?? resume.linkedin;
    resume.website = req.body.website ?? resume.website;
    resume.summary = req.body.summary ?? resume.summary;

    // 6️⃣ Update nested arrays
    resume.education = education;
    resume.experience = experience;
    resume.projects = projects;
    resume.skills = skills;
    resume.languages = languages;

    // 7️⃣ Profile Image update
    if (req.file) {
      if (resume.profileImage?.public_id) {
        await deleteCloudinaryImage(resume.profileImage.public_id);
      }
      resume.profileImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // 8️⃣ Save
    await resume.save();

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Resume
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // 🔐 Authorization
    if (
      resume.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this resume" });
    }

    // 🖼️ Delete profile image from Cloudinary
    if (resume.profileImage?.public_id) {
      await deleteCloudinaryImage(resume.profileImage.public_id);
    }

    // 🗑️ Delete resume
    await resume.deleteOne();

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPublicResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    // Make sure resume exists and is public
    if (!resume || resume.isPublic !== true) {
      return res.status(404).json({
        success: false,
        message: "Resume not public",
      });
    }

    res.json({
      success: true,
      resume,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
