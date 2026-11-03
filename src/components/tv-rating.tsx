"use client";

import { useState } from "react";

function TvIcon({
  filled,
  className = "h-7 w-8",
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 36 32"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 6 8 2M24 6l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect
        x="3"
        y="6"
        width="30"
        height="22"
        rx="5"
        fill={filled ? "currentColor" : "transparent"}
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="8"
        y="11"
        width="16"
        height="12"
        rx="2"
        fill={filled ? "#fff1d6" : "transparent"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="28.5" cy="13" r="1.4" fill={filled ? "#fff1d6" : "currentColor"} />
      <circle cx="28.5" cy="18" r="1.4" fill={filled ? "#fff1d6" : "currentColor"} />
      <path d="M11 31h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TvRatingInput({
  initialValue = 0,
  error,
}: {
  initialValue?: number;
  error?: string;
}) {
  const [rating, setRating] = useState(initialValue);

  return (
    <fieldset
      aria-invalid={Boolean(error)}
      aria-describedby={error ? "rating-error" : "rating-help"}
    >
      <legend className="text-sm font-bold text-[#492740]">My rating</legend>
      <p id="rating-help" className="mt-1 text-sm text-[#6e3b5d]">
        Optional—pick up to five little TVs.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <label
            key={value}
            className="group cursor-pointer rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-[#d65a4a] focus-within:ring-offset-2"
            title={`${value} out of 5 TVs`}
          >
            <input
              type="radio"
              name="rating"
              value={value}
              checked={rating === value}
              onChange={() => setRating(value)}
              className="sr-only"
            />
            <span className="sr-only">{value} out of 5 TVs</span>
            <TvIcon
              filled={value <= rating}
              className={`h-8 w-9 transition group-hover:scale-105 ${
                value <= rating ? "text-[#d65a4a]" : "text-[#6e3b5d]/35"
              }`}
            />
          </label>
        ))}
        {rating > 0 && (
          <button
            type="button"
            onClick={() => setRating(0)}
            className="ml-1 text-sm font-bold text-[#6e3b5d] underline decoration-[#f29e4c] decoration-2 underline-offset-4"
          >
            Clear rating
          </button>
        )}
      </div>
      {error && (
        <p id="rating-error" className="mt-2 text-sm font-semibold text-[#8b3028]">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function TvRatingDisplay({
  rating,
  compact = false,
}: {
  rating: number;
  compact?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 TVs`}
      className="flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <TvIcon
          key={value}
          filled={value <= rating}
          className={compact ? "h-5 w-6" : "h-7 w-8"}
        />
      ))}
    </div>
  );
}
