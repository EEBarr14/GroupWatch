"use client";

import { useId, useState } from "react";

type PasswordFieldProps = {
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  required?: boolean;
  autoFocus?: boolean;
  helpText?: string;
};

export function PasswordField({
  name,
  label,
  autoComplete,
  minLength,
  required = false,
  autoFocus = false,
  helpText,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const inputId = useId();
  const helpId = `${inputId}-help`;

  return (
    <div className="block">
      <label htmlFor={inputId} className="mb-2 block text-sm font-bold">
        {label}
      </label>
      <span className="relative block">
        <input
          id={inputId}
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
          autoFocus={autoFocus}
          aria-describedby={helpText ? helpId : undefined}
          className="w-full rounded-xl border border-[#6e3b5d]/25 bg-white px-4 py-3.5 pr-28 text-base shadow-sm"
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-controls={inputId}
          aria-pressed={isVisible}
          className="absolute inset-y-1.5 right-1.5 rounded-lg px-3 text-sm font-bold text-[#6e3b5d] transition hover:bg-[#6e3b5d]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d65a4a]"
        >
          {isVisible ? "Hide password" : "Show password"}
        </button>
      </span>
      {helpText && (
        <span id={helpId} className="mt-2 block text-sm text-[#6e3b5d]">
          {helpText}
        </span>
      )}
    </div>
  );
}
