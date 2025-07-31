// "use client";
// import React, { useState } from "react";
// import { Label } from "../components/ui/label";
// import { Input } from "../components/ui/input";
// import { cn } from "@/lib/utils";
// import { Link, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function LoginForm() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.id]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:5555/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Login successful!");

//         // Save tokens
//         localStorage.setItem("access_token", data.access_token);
//         localStorage.setItem("refresh_token", data.refresh_token);

//         // Save role if needed
//         if (data.role) {
//           localStorage.setItem("user_role", data.role);
//         }

//         // --- REDIRECTION LOGIC BASED ON data.role from backend ---
//         if (data.role === "student") {
//           navigate("/dashboard"); // Takes student to dashboard
//         } else if (data.role === "admin") {
//           navigate("/admin-dashboard"); // Takes admin to admin dashboard
//         } else {
//           navigate("/home"); // Takes other users (e.g., 'user' role) to the shop page
//         }
//         // --- END REDIRECTION LOGIC ---

//       } else {
//         toast.error(data.msg || "Login failed.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-black px-4 overflow-hidden">
//       <ToastContainer />
//       <div className="w-full max-w-md bg-black p-4 md:rounded-2xl md:p-8 border-none">
//         <h2 className="text-xl font-bold text-white text-center">
//           Welcome Back
//         </h2>
//         <form className="my-8" onSubmit={handleSubmit}>
//           {/* Ensure this Link does not contain another <a> or Link inside it */}
//           <Link
//             to="/"
//             className="absolute top-4 left-4 flex items-center gap-2 text-sm text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors duration-200"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               className="h-4 w-4"
//             >
//               <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h5v-5h2v5h5a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z" />
//             </svg>
//             <span>Home</span>
//           </Link>

//           {/* Email */}
//           <LabelInputContainer className="mb-4">
//             <Label
//               htmlFor="email"
//               className="text-sm text-white text-left m-0 p-0"
//             >
//               Email Address
//             </Label>
//             <Input
//               id="email"
//               placeholder="Enter your email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
//               required
//             />
//           </LabelInputContainer>

//           {/* Password */}
//           <LabelInputContainer className="mb-4">
//             <Label
//               htmlFor="password"
//               className="text-sm text-white text-left m-0 p-0"
//             >
//               Password
//             </Label>
//             <Input
//               id="password"
//               placeholder="Enter your password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="bg-zinc-900 text-white border-none rounded-md shadow-inner h-10 px-3"
//               required
//             />
//           </LabelInputContainer>

//           <button
//             className="relative group/btn h-10 w-full rounded-md bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition"
//             type="submit"
//           >
//             Login
//             <BottomGradient />
//           </button>

//           <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />
//         </form>
//       </div>
//     </div>
//   );
// }

// // Helper Components remain the same
// const LabelInputContainer = ({ children, className }) => {
//   return (
//     <div className={cn("flex flex-col w-full", className)}>{children}</div>
//   );
// };

// const BottomGradient = () => {
//   return (
//     <>
//       <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute inset-x-0 -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px" />
//       <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute inset-x-0 -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px" />
//     </>
//   );
// };


// "use client";
// import React, { useState, useEffect, useContext } from "react";
// import { Label } from "../components/ui/label";
// import { Input } from "../components/ui/input";
// import { cn } from "@/lib/utils";
// import { Link, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GoogleLogin } from "@react-oauth/google";
// import { useGoogleAuth, GoogleOAuthProvider } from "../context/GoogleOAuthContext";

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const {
//     handleGoogleSuccess,
//     handleGoogleError,
//     isGoogleAuth,
//     isLoading,
//     error,
//   } = useGoogleAuth();

//   // Get API URL from environment variable or use default
//   const API_URL =
//     import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5555";

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.id]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${API_URL}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Login successful!");

//         // Save tokens
//         localStorage.setItem("access_token", data.access_token);
//         localStorage.setItem("refresh_token", data.refresh_token);

//         // Save role if needed
//         if (data.role) {
//           localStorage.setItem("user_role", data.role);
//         }

//         // --- REDIRECTION LOGIC BASED ON data.role from backend ---
//         if (data.role === "student") {
//           navigate("/dashboard"); // Takes student to dashboard
//         } else if (data.role === "admin") {
//           navigate("/admin-dashboard"); // Takes admin to admin dashboard
//         } else {
//           navigate("/home"); // Takes other users (e.g., 'user' role) to the shop page
//         }
//         // --- END REDIRECTION LOGIC ---
//       } else {
//         toast.error(data.msg || "Login failed.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center px-4 overflow-hidden relative bg-black">
//       {/* Background Image with Overlay */}
//       <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
//         style={{
//           backgroundImage:
//             "url(/blue-wave-is-lit-up-black-background_889227-20579.png)",
//           opacity: 0.7,
//         }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
//       </div>

//       <ToastContainer position="top-center" autoClose={2000} />

//       {/* Home Link */}
//       <Link
//         to="/"
//         className="absolute top-4 left-4 flex items-center gap-1 text-sm text-white px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300 z-10 border border-white/20"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           className="h-4 w-4"
//         >
//           <path d="M10.707 1.293a1 1 0 00-1.414 0l-8 8A1 1 0 002 10h1v7a1 1 0 001 1h5v-5h2v5h5a1 1 0 001-1v-7h1a1 1 0 00.707-1.707l-8-8z" />
//         </svg>
//         <span>Home</span>
//       </Link>

//       {/* Glassmorphic Form */}
//       <div className="w-full max-w-md p-8 rounded-2xl z-10 relative overflow-hidden">
//         {/* Glassmorphic Container */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-orange-500/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl" />

//         {/* Decorative Elements */}
//         <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl" />
//         <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/20 rounded-full filter blur-3xl" />

//         <div className="relative z-10">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent mb-2">
//               Welcome Back
//             </h2>
//             <p className="text-gray-300 text-sm">Sign in to your account</p>
//           </div>

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             {/* Email */}
//             <LabelInputContainer>
//               <Label htmlFor="email" className="text-sm text-white text-left">
//                 Email Address
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
//                   required
//                 />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="h-5 w-5 text-gray-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                     <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                   </svg>
//                 </div>
//               </div>
//             </LabelInputContainer>

//             {/* Password */}
//             <LabelInputContainer>
//               <Label
//                 htmlFor="password"
//                 className="text-sm text-white text-left"
//               >
//                 Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
//                   required
//                 />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg
//                     className="h-5 w-5 text-gray-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </LabelInputContainer>

//             {/* Divider with Text */}
//             <div className="relative my-6">
//               <div
//                 className="absolute inset-0 flex items-center"
//                 aria-hidden="true"
//               >
//                 <div className="w-full border-t border-white/10"></div>
//               </div>
//               <div className="relative flex justify-center">
//                 <span className="px-3 bg-gradient-to-r from-blue-900/80 via-blue-800/50 to-orange-500/50 text-sm text-gray-300 rounded-full backdrop-blur-sm">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             {/* Google Sign-In Button */}
//             <div className="w-full flex justify-center mb-4">
//               <div className="w-full">
//                 <div className="relative w-full">
//                   <GoogleOAuthProvider
//                     clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
//                   >
//                     <GoogleLogin
//                       onSuccess={handleGoogleSuccess}
//                       onError={handleGoogleError}
//                       useOneTap
//                       auto_select
//                       theme="filled_black"
//                       size="large"
//                       text="signin_with"
//                       shape="rectangular"
//                       // width="100%"
//                       width="250"
//                       className={`w-full google-signin-button ${
//                         isLoading ? "opacity-50" : ""
//                       }`}
//                       disabled={isLoading}
//                       ux_mode="redirect"
//                       scope="openid profile email"
//                       prompt="select_account"
//                       cookie_policy="single_host_origin"
//                     />
//                   </GoogleOAuthProvider>
//                   {isLoading && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
//                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
//                     </div>
//                   )}
//                   {error && (
//                     <p className="mt-2 text-sm text-red-500">{error}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 mt-2 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
//             >
//               <svg
//                 className="w-5 h-5 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
//                 />
//               </svg>
//               Sign In
//             </button>

//             {/* Sign Up Link */}
//             <p className="text-center text-sm text-gray-400 mt-6">
//               Don't have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
//               >
//                 Sign up
//               </Link>
//             </p>

//             {/* Forgot Password Link */}
//             <p className="text-center mt-2">
//               <Link
//                 to="/forgot-password"
//                 className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
//               >
//                 Forgot your password?
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

// // Helper component for form inputs
// const LabelInputContainer = ({ children, className }) => {
//   return (
//     <div className={cn("flex flex-col w-full space-y-1", className)}>
//       {children}
//     </div>
//   );
// };

// "use client"; // Keep this if it's required by your framework, otherwise it can be removed
import React, { useState, useEffect, useContext } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth, GoogleOAuthProvider } from "../context/GoogleOAuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    handleGoogleSuccess,
    handleGoogleError,
    isGoogleAuth,
    isLoading,
    error,
  } = useGoogleAuth();

  // Get API URL from environment variable or use default
  const API_URL =
    import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5555";

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
      const res = await fetch(`${API_URL}/api/auth/login`, {
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
          navigate("/home"); // Takes other users (e.g., 'user' role) to the shop page
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
    <div className="min-h-screen w-full flex items-center justify-center px-4 overflow-hidden relative bg-black">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url(/blue-wave-is-lit-up-black-background_889227-20579.png)",
          opacity: 0.7,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />

      {/* Home Link */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-1 text-sm text-white px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300 z-10 border border-white/20"
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

      {/* Glassmorphic Form */}
      <div className="w-full max-w-md p-8 rounded-2xl z-10 relative overflow-hidden">
        {/* Glassmorphic Container */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-orange-500/10 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl" />

        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/20 rounded-full filter blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-300 text-sm">Sign in to your account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <LabelInputContainer>
              <Label htmlFor="email" className="text-sm text-white text-left">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </LabelInputContainer>

            {/* Password */}
            <LabelInputContainer>
              <Label
                htmlFor="password"
                className="text-sm text-white text-left"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </LabelInputContainer>

            {/* Divider with Text */}
            <div className="relative my-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-gradient-to-r from-blue-900/80 via-blue-800/50 to-orange-500/50 text-sm text-gray-300 rounded-full backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <div className="w-full flex justify-center mb-4">
              <div className="w-full">
                <div className="relative w-full">
                  <GoogleOAuthProvider
                    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      auto_select
                      theme="filled_black"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                      // width="100%"
                      width="250"
                      className={`w-full google-signin-button ${
                        isLoading ? "opacity-50" : ""
                      }`}
                      disabled={isLoading}
                      // *** IMPORTANT CHANGE: Use redirect mode instead of popup ***
                      ux_mode="redirect" //
                      scope="openid profile email"
                      prompt="select_account"
                      cookie_policy="single_host_origin"
                    />
                  </GoogleOAuthProvider>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 mt-2 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>

            {/* Forgot Password Link */}
            <p className="text-center mt-2">
              <Link
                to="/forgot-password"
                className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
              >
                Forgot your password?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

// Helper component for form inputs
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col w-full space-y-1", className)}>
      {children}
    </div>
  );
};