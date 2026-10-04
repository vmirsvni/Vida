/* Hairline icons — 1.25px strokes, drawn to sit quietly beside type. */

type P = { className?: string; size?: number };

const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/** Points toward reading direction (left in RTL) */
export const ArrowLeft = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
);
export const ArrowRight = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h16M14 6l6 6-6 6" />
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
export const Plus = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Close = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Check = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const Clock = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const Lock = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="5" y="10.5" width="14" height="10" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
);

export const UserIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
  </svg>
);

export const CardIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3 10h18M7 15h4" />
  </svg>
);
