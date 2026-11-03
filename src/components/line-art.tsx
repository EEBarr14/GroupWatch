type LineArtProps = {
  className?: string;
  stroke?: string;
  accent?: string;
};

export function WatchPartyLineArt({
  className = "",
  stroke = "currentColor",
  accent = "#f6c85f",
}: LineArtProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 720 380"
      fill="none"
      className={className}
    >
      <path
        d="M88 307H32m656 0h-58M88 307c0-31 14-54 43-58 22-3 53 3 75 3h309c24 0 55-6 76-3 27 4 39 27 39 58"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M178 251c-8-23-9-51 2-72 12-23 35-32 57-22 21 10 30 35 21 55-5 13-16 22-29 27m-43-61c-17 10-27 29-25 49 1 11 5 20 12 27m73-91c12 3 22 11 29 22"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M248 247c18-22 39-32 65-34m-80 38c-3-15 3-28 16-35 9-5 20-5 29 1 11 8 14 23 8 35"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M314 213c-12-14-14-34-6-50 10-22 38-29 58-16 18 12 24 37 13 56-5 9-13 15-22 19m-43-9c-12 9-20 21-23 37m66-28c20 7 36 18 46 32"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M403 254c8-23 24-39 46-47m0 0c-8-18-4-39 11-52 17-16 45-14 60 4 14 17 12 43-5 58-6 6-14 9-22 11m-44-21c9 22 25 37 48 45"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M529 251c17-24 40-35 70-31m-53 28c10-9 24-13 37-10 10 2 18 7 25 15"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M286 268c21 8 45 12 72 12 29 0 55-5 76-14"
        stroke={accent}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M262 53h196v105H262zM272 63h176v85H272"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M344 158h32m-49 12h66M333 112c17-20 35-30 55-30 18 0 34 8 47 23"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M213 220l13-35 13 35h-26zm348-7c-7-7-18-7-25 0-7 7-7 18 0 25l25 23 25-23c7-7 7-18 0-25-7-7-18-7-25 0z"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DesertLineArt({
  className = "",
  stroke = "currentColor",
  accent = "#f29e4c",
}: LineArtProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 720 180"
      fill="none"
      className={className}
    >
      <path
        d="M18 151c92-58 159-60 246-8 74 44 155 39 239-13 67-41 125-38 199 10"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M80 151c49-27 91-31 139-14 40 14 78 21 116 19m100-9c40-5 75-18 111-39 45-27 84-28 129-4"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M359 48c-32 0-58 26-58 58h116c0-32-26-58-58-58z"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M359 24v13m-64 3 10 10m108-10-10 10m37 31h-14m-134 0h-14"
        stroke={accent}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
