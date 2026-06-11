"use client";

import { useState } from "react";

type AuthFormFieldProps = {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  type: string;
  autoComplete: string;
  error?: string;
  hint?: string;
  required?: boolean;
  minLength?: number;
};

export default function AuthFormField({
  id,
  label,
  name,
  placeholder,
  type,
  autoComplete,
  error,
  hint,
  required = true,
  minLength,
}: AuthFormFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <div className="group block">
      <label
        htmlFor={id}
        className="font-condensed text-2xl font-bold uppercase tracking-[0.18em] text-white/75 transition-colors duration-200 group-focus-within:text-lime md:text-xl"
      >
        {label}
        {hint && (
          <span className="ml-3 font-condensed text-xs font-normal normal-case tracking-[0.1em] text-white/40">
            ({hint})
          </span>
        )}
      </label>
      <div className="relative mt-4 md:mt-2.5">
        <input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`h-20 w-full border-4 border-[#343438] bg-black/45 px-6 font-condensed text-2xl tracking-[0.04em] text-white outline-none transition-all duration-200 placeholder:text-white/30 hover:border-lime/70 hover:bg-black/70 hover:placeholder:text-white/45 focus:border-lime focus:bg-black focus:shadow-[0_0_0_1px_var(--neon-lime)] md:h-14 md:border-2 md:px-4 md:text-xl ${
            isPasswordField ? "pr-20" : ""
          } ${error ? "border-pink focus:border-pink focus:shadow-[0_0_0_1px_#ff2d9b]" : ""}`}
        />
        {isPasswordField && (
          <button
            type="button"
            aria-label={isPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/50 transition-colors duration-200 hover:text-lime focus:outline-none focus-visible:text-lime"
          >
            {isPasswordVisible ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
                <path
                  d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.5 5.6A9.7 9.7 0 0 1 12 5c5 0 8.5 4.5 9.5 7a12.8 12.8 0 0 1-2.6 3.8M6.3 6.9A13.2 13.2 0 0 0 2.5 12c1 2.5 4.5 7 9.5 7a9.8 9.8 0 0 0 4.4-1"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
                <path
                  d="M2.5 12c1-2.5 4.5-7 9.5-7s8.5 4.5 9.5 7c-1 2.5-4.5 7-9.5 7S3.5 14.5 2.5 12Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </button>
        )}
        {error && (
          <p className="mt-2 font-condensed text-xs font-bold uppercase tracking-[0.15em] text-pink">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
