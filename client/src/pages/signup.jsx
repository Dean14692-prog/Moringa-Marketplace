"use client";
import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    // 'role' removed from state as frontend no longer sends it for registration
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      confirmPassword,
    } = formData;

    // Frontend validation
    if (
      !first_name ||
      !last_name ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5555/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          username,
          email,
          password,
          // Do NOT send 'role' here. Backend determines it based on email.
          bio: "", // You can make these optional or collect them on a profile page later
          github: "",
          linkedin: "",
          skills: "",
          profile_pic: "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Signup successful! Please log in.");
        console.log("Registered User Data:", data); // Log the full response data
        if (data.role) {
          console.log("User registered with role:", data.role); // Access the role directly from backend response
        }
        navigate("/login"); // Redirect to login page after successful signup
      } else {
        toast.error(data.msg || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Network error or server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 overflow-hidden relative">
      <ToastContainer position="top-center" autoClose={2000} />
      {/* Ensure this Link does not contain another <a> or Link inside it */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-1 text-sm text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors duration-200"
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

      <div className="w-full max-w-md bg-black p-4 md:rounded-2xl md:p-8 border-none">
        <h2 className="text-xl font-bold text-white text-center mb-4">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:flex-row">
            <LabelInputContainer>
              <Label
                htmlFor="first_name"
                className="text-sm text-white text-left"
              >
                First name
              </Label>
              <Input
                id="first_name"
                type="text"
                placeholder="First Name"
                className="bg-zinc-900 text-white"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label
                htmlFor="last_name"
                className="text-sm text-white text-left"
              >
                Last name
              </Label>
              <Input
                id="last_name"
                type="text"
                placeholder="Last Name"
                className="bg-zinc-900 text-white"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </LabelInputContainer>
          </div>

          <LabelInputContainer>
            <Label htmlFor="username" className="text-sm text-white text-left">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="bg-zinc-900 text-white"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="email" className="text-sm text-white text-left">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="bg-zinc-900 text-white"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password" className="text-sm text-white text-left">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="bg-zinc-900 text-white"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label
              htmlFor="confirmPassword"
              className="text-sm text-white text-left"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="bg-zinc-900 text-white"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>

          <button
            className="relative group/btn h-10 w-full rounded-md bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition mt-2 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
            <BottomGradient />
          </button>

          <p className="text-sm text-neutral-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-700 hover:underline">
              Login here
            </Link>
          </p>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
        </form>
      </div>
    </div>
  );
}

// Utility components (assuming these are defined elsewhere or provided)
const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col w-full space-y-1", className)}>
    {children}
  </div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm group-hover/btn:opacity-100" />
  </>
);