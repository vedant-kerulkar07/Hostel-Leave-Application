import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../services/email.js";

// Utility to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// --------------------- REGISTER ---------------------
export const Register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(handleError(409, "User already registered"));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();

    const token = generateToken(user);

    const userData = user.toObject({ getters: true });
    delete userData.password;

    res.status(201).json({
      success: true,
      user: userData,
      token,
      message: "Registration successful",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// --------------------- LOGIN ---------------------
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(handleError(404, "Invalid login credential"));

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return next(handleError(401, "Invalid login credential"));

    const token = generateToken(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    const userData = user.toObject({ getters: true });
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData,
      token,
      message: "Login successful",
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

// --------------------- GOOGLE LOGIN ---------------------
export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(randomPassword, 10);

      user = await new User({
        name,
        email,
        password: hashedPassword,
        avatar,
      }).save();
    }

    const token = generateToken(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    const userData = user.toObject({ getters: true });
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData,
      token,
      message: "Google login successful",
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

// --------------------- LOGOUT ---------------------
export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

// ------------------- FORGOT PASSWORD -------------------
export const ForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(handleError(404, "User not found"));

    // Generate reset token & expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Reset URL (frontend)
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // Send email via Resend
    try {
      await sendResetPasswordEmail(email, user.name, resetURL);
    } catch (err) {
      return next(handleError(500, err.message));
    }

    res.json({ success: true, message: "Password reset link sent" });
  } catch (err) {
    next(handleError(500, err.message));
  }
};

// ------------------- RESET PASSWORD -------------------
export const ResetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return next(handleError(400, "Invalid or expired token"));

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    next(handleError(500, err.message));
  }
};
