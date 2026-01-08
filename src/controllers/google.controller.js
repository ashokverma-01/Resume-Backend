import jwt from "jsonwebtoken";

export const googleLoginSuccess = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // google.controller.js
  res.redirect(
    `${process.env.CLIENT_URL}/google-success?token=${token}&fullName=${user.fullName}&email=${user.email}`
  );
};
