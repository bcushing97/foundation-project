export function PlaceSettingIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 38 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Knife (left) */}
      <path d="M8 6 L8 18" />
      <path d="M7.5 6 L8.5 6" />
      
      {/* Plate (center) */}
      <circle cx="19" cy="12" r="6" />
      
      {/* Fork (right) */}
      <path d="M30 6 L30 18" />
      <path d="M28 6 L28 10" />
      <path d="M30 6 L30 10" />
      <path d="M32 6 L32 10" />
    </svg>
  );
}