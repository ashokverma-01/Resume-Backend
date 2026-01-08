import express from "express";
import passport from "passport";
import { googleLoginSuccess } from "../controllers/google.controller.js";

const router = express.Router();

router.get(
  "/google-login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google",
  passport.authenticate("google", { session: false }),
  googleLoginSuccess
);

export default router;
