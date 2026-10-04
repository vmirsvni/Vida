/* The single decorative mark kept from the reference: a four-point sparkle. */

export function Sparkle({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M12 1.5c.5 5.6 2.4 8.9 10.5 10.5-8.1 1.6-10 4.9-10.5 10.5-.5-5.6-2.4-8.9-10.5-10.5C9.6 10.4 11.5 7.1 12 1.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
