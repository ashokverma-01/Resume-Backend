import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary.service.js";

// Profile Image Storage
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Resume/Images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Multer instances
const upload = multer({ storage: imageStorage });

export default upload;
