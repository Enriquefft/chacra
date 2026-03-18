export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 164 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Chacra"
    >
      <path d="M8 4H18V22H0V12A8 8 0 018 4Z" fill="#B7522A" />
      <path d="M22 4H32A8 8 0 0140 12V22H22V4Z" fill="#4D8B4A" />
      <path d="M0 26H18V44H8A8 8 0 010 36V26Z" fill="#C4A030" />
      <path d="M22 26H40V36A8 8 0 0132 44H22V26Z" fill="#82A088" />
      <text
        x="52"
        y="34"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="28"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        Chacra
      </text>
    </svg>
  )
}
