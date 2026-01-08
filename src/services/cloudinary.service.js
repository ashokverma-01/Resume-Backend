import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete image (poster, profileImage)
export const deleteCloudinaryImage = async (public_id) => {
  if (!public_id) return;
  await cloudinary.uploader.destroy(public_id);
};

export default cloudinary;
