import mongoose from "mongoose";

// Education Sub-schema
const educationSchema = new mongoose.Schema(
  {
    institute: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
  },
  { _id: false }
);

// Experience Sub-schema
const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: false }
);

// Project Sub-schema
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: false }
);

// Main Resume Schema
const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fullName: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    website: { type: String, trim: true },
    summary: { type: String, trim: true, maxlength: 2000 },

    languages: { type: [String], default: [] },
    skills: { type: [String], default: [] },

    education: { type: [educationSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    projects: { type: [projectSchema], default: [] },

    profileImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

resumeSchema.index({ user: 1 });

export default mongoose.model("Resume", resumeSchema);
