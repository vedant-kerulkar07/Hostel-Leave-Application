// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import GoogleLogin from "./GoogleLogin";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import ProfilePopup from "@/components/ProfilePopup";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Form validation schema
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Handle submit
  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await fetch(`${getEnv("VITE_API_URL")}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include", // cookie-based auth
      });

      const data = await response.json();

      if (!response.ok) {
        return showToast("error", data.message);
      }

      // ✅ Save user in Redux
      dispatch(setUser(data));

      if (data.user.role === "admin") {
        // Admin → straight to admin dashboard
        navigate("/admin");
      } else {
        // Normal user
        if (!data.user.roomNumber || !data.user.phoneNumber) {
          // Profile incomplete → open popup
          setShowProfilePopup(true);
        } else {
          // Profile complete → straight to dashboard
          navigate("/dashboard");
        }
      }

      showToast("success", data.message);
    } catch (err) {
      showToast("error", err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-white p-8 rounded-xl w-96 shadow-lg text-center">
        <h2 className="text-gray-800 mb-5 text-2xl font-semibold">
          Welcome Back, Student
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4 text-left">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="you@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-4 text-left">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="****" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember me + Forgot password */}
            <div className="flex justify-between text-xs mb-5">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" /> Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#125c60] text-white rounded-md font-bold mb-4 hover:bg-[#0f4a4d] transition"
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          </form>
        </Form>

        <div className="text-xs mb-4">
          Forget your password?{" "}
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Signup Link */}
        <p className="text-xs mb-4">
          New to DormDash?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>

        {/* OR Divider */}
        <div className="flex items-center justify-center text-xs text-gray-600 mb-4">
          <span>OR</span>
        </div>

        {/* Google Login */}
        <GoogleLogin />
      </div>

      {/* ✅ Profile Popup (only for normal users) */}
      {showProfilePopup && (
        <ProfilePopup
          onClose={() => {
            setShowProfilePopup(false);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
};

export default Login;
