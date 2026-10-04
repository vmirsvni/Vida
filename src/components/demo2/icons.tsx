/* Rounded, friendly strokes for demo 2 (matches the reference's soft UI). */

type P = { className?: string; size?: number; filled?: boolean };
const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/** "↗" mirrored for RTL → points up-left */
export const ArrowUpLeft = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M17 17 7 7M7 15V7h8" />
  </svg>
);
export const ChevronLeft = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M14 6l-6 6 6 6" />
  </svg>
);
export const ChevronRight = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m10 6 6 6-6 6" />
  </svg>
);
export const ArrowL = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M19 12H5m6-6-6 6 6 6" />
  </svg>
);
export const ArrowR = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);
export const Search = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
export const CalendarIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="5" width="16" height="15" rx="3" />
    <path d="M8 3v4M16 3v4M4 10h16" />
  </svg>
);
export const User = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" />
  </svg>
);
export const Menu = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 8h14M5 12h14M5 16h14" />
  </svg>
);
export const Close = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Play = ({ className, size }: P) => (
  <svg width={size ?? 18} height={size ?? 18} viewBox="0 0 24 24" className={className} aria-hidden>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.8l-10-6.5A1 1 0 0 0 8 5.5Z" fill="currentColor" />
  </svg>
);
export const Heart = ({ className, size, filled }: P) => (
  <svg {...base(size)} className={className} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);
export const Phone = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const Pin = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const Insta = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);
/** Four-petal blossom used on the tag pills */
export const Flower = ({ className, size }: P) => (
  <svg width={size ?? 16} height={size ?? 16} viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12 2c2 0 3.2 2 3 4.2 2.2-.2 4.2 1 4.2 3s-1.6 2.8-2.9 2.8c1.3 0 2.9.8 2.9 2.8s-2 3.2-4.2 3C15.2 20 14 22 12 22s-3.2-2-3-4.2c-2.2.2-4.2-1-4.2-3S6.4 12 7.7 12C6.4 12 4.8 11.2 4.8 9.2s2-3.2 4.2-3C8.8 4 10 2 12 2Z" />
    <circle cx="12" cy="12" r="2.2" fill="var(--color-ivory, #fff)" opacity=".55" />
  </svg>
);
