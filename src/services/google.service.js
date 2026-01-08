import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        // 🔁 Account linking
        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = "google";
            user.profileImage.url = profile.photos[0].value;
            await user.save();
          }
          return done(null, user);
        }

        // 🆕 New Google User
        user = await User.create({
          fullName: profile.displayName,
          email,
          googleId: profile.id,
          authProvider: "google",
          profileImage: {
            url: profile.photos[0].value,
          },
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
