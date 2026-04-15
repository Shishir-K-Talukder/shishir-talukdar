export function SktLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="20" cy="20" r="19" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="hsl(var(--primary) / 0.08)" />
      
      {/* Flask body */}
      <path
        d="M16 10V18L11 28C10.4 29.2 11.3 30.5 12.6 30.5H27.4C28.7 30.5 29.6 29.2 29 28L24 18V10"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="hsl(var(--primary) / 0.12)"
      />
      
      {/* Flask neck */}
      <line x1="15" y1="10" x2="25" y2="10" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Liquid level */}
      <path
        d="M13.5 24H26.5"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      
      {/* Bubbles */}
      <circle cx="18" cy="26" r="1.2" fill="hsl(var(--primary))" opacity="0.6" />
      <circle cx="22" cy="27.5" r="0.8" fill="hsl(var(--primary))" opacity="0.4" />
      <circle cx="20" cy="24.5" r="0.6" fill="hsl(var(--primary))" opacity="0.5" />
      
      {/* SKT initials */}
      <text
        x="20"
        y="8"
        textAnchor="middle"
        fontSize="4.5"
        fontWeight="700"
        fill="hsl(var(--primary))"
        fontFamily="var(--font-heading), system-ui, sans-serif"
        letterSpacing="0.5"
      >
        SKT
      </text>
    </svg>
  );
}
