"use client";
import React from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function SignupForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 overflow-hidden">
      <div className="w-full max-w-md bg-black p-4 md:rounded-2xl md:p-8 border-none">
        <h2 className="text-xl font-bold text-white text-center mb-4">
          Create Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:flex-row">
          <Link
            to="/login"
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

            <LabelInputContainer>
              <Label
                htmlFor="firstname"
                className="text-sm text-white text-left"
              >
                First name
              </Label>
              <Input
                id="firstname"
                placeholder="First Name"
                type="text"
                className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label
                htmlFor="lastname"
                className="text-sm text-white text-left"
              >
                Last name
              </Label>
              <Input
                id="lastname"
                placeholder="Last Name"
                type="text"
                className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
              />
            </LabelInputContainer>
          </div>

          <LabelInputContainer>
            <Label htmlFor="email" className="text-sm text-white text-left">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="email adress"
              type="email"
              className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password" className="text-sm text-white text-left">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label
              htmlFor="twitterpassword"
              className="text-sm text-white text-left"
            >
              Confirm your password
            </Label>
            <Input
              id="twitterpassword"
              placeholder="confirm password"
              type="password"
              className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
            />
          </LabelInputContainer>

          <button
            className="relative group/btn h-10 w-full rounded-md bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition mt-2"
            type="submit"
          >
            Sign up
            <BottomGradient />
          </button>

          <p className="text-sm text-neutral-400 text-center">
            Already have an account?
            <Link to="/login" className="text-cyan-700 hover:underline gap-1">
              Login here
            </Link>
          </p>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
        </form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col w-full space-y-1", className)}>
      {children}
    </div>
  );
};

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm group-hover/btn:opacity-100" />
  </>
);
