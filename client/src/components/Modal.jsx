import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-[#0D1B2A] hover:text-[#1C2541] text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
