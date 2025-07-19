"use client";
import React from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 overflow-hidden">
      <div className="w-full max-w-md bg-black p-4 md:rounded-2xl md:p-8 border-none">
        <h2 className="text-xl font-bold text-white text-center">
          Welcome Back, Aaron
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
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

          <LabelInputContainer className="mb-4">
            <Label
              htmlFor="email"
              className="text-sm text-white text-left m-0 p-0"
            >
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="email adress"
              type="email"
              className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label
              htmlFor="password"
              className="text-sm text-white text-left m-0 p-0"
            >
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
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

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col w-full", className)}>{children}</div>
  );
};

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm group-hover/btn:opacity-100" />
  </>
);
