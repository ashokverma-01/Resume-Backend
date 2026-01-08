import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileImage: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
      googleId: {
        type: String,
        default: "",
      },

      authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
