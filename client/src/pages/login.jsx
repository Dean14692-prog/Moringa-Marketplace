"use client";
import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5555/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");

        // Save tokens
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        // Save role if needed
        if (data.role) {
          localStorage.setItem("user_role", data.role);
        }

        // --- REDIRECTION LOGIC BASED ON data.role from backend ---
        if (data.role === "student") {
          navigate("/dashboard"); // Takes student to dashboard
        } else if (data.role === "admin") {
          navigate("/admin-dashboard"); // Takes admin to admin dashboard
        } else {
          navigate("/shop"); // Takes other users (e.g., 'user' role) to the shop page
        }
        // --- END REDIRECTION LOGIC ---

      } else {
        toast.error(data.msg || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 overflow-hidden">
      <ToastContainer />
      <div className="w-full max-w-md bg-black p-4 md:rounded-2xl md:p-8 border-none">
        <h2 className="text-xl font-bold text-white text-center">
          Welcome Back
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
          {/* Ensure this Link does not contain another <a> or Link inside it */}
          <Link
            to="/"
            className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              className="h-4 w-4"
            >
              <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h5v-5h2v5h5a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z" />
            </svg>
            <span>Home</span>
          </Link>

          {/* Email */}
          <LabelInputContainer className="mb-4">
            <Label
              htmlFor="email"
              className="text-sm text-white text-left m-0 p-0"
            >
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
              required
            />
          </LabelInputContainer>

          {/* Password */}
          <LabelInputContainer className="mb-4">
            <Label
              htmlFor="password"
              className="text-sm text-white text-left m-0 p-0"
            >
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
              required
            />
          </LabelInputContainer>

          <button
            className="relative group/btn h-10 w-full rounded-md bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition"
            type="submit"
          >
            Login
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
        </form>
      </div>
    </div>
  );
}

// Helper Components remain the same
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col w-full", className)}>{children}</div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute inset-x-0 -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute inset-x-0 -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px" />
    </>
  );
};