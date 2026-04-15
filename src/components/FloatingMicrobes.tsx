import { useMemo } from "react";

interface Microbe {
  id: number;
  type: "coccus" | "bacillus" | "spirillum" | "dna";
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  opacity: number;
}

function MicrobeShape({ type, size }: { type: Microbe["type"]; size: number }) {
  const color = "hsl(var(--primary) / 0.12)";
  const accent = "hsl(var(--accent) / 0.10)";

  switch (type) {
    case "coccus":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="16" stroke={color} strokeWidth="1.5" />
          <circle cx="20" cy="20" r="8" stroke={accent} strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      );
    case "bacillus":
      return (
        <svg width={size * 1.8} height={size} viewBox="0 0 60 30" fill="none">
          <rect x="5" y="5" width="50" height="20" rx="10" stroke={color} strokeWidth="1.5" />
          <line x1="30" y1="8" x2="30" y2="22" stroke={accent} strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case "spirillum":
      return (
        <svg width={size * 1.5} height={size} viewBox="0 0 50 30" fill="none">
          <path
            d="M5 15C10 5 15 25 20 15C25 5 30 25 35 15C40 5 45 25 50 15"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      );
    case "dna":
      return (
        <svg width={size * 0.6} height={size * 1.5} viewBox="0 0 20 50" fill="none">
          <path d="M5 5C5 15 15 15 15 25C15 35 5 35 5 45" stroke={color} strokeWidth="1.2" />
          <path d="M15 5C15 15 5 15 5 25C5 35 15 35 15 45" stroke={accent} strokeWidth="1.2" />
          <line x1="7" y1="15" x2="13" y2="15" stroke={color} strokeWidth="0.8" />
          <line x1="7" y1="25" x2="13" y2="25" stroke={color} strokeWidth="0.8" />
          <line x1="7" y1="35" x2="13" y2="35" stroke={color} strokeWidth="0.8" />
        </svg>
      );
  }
}

export function FloatingMicrobes({ count = 6, className = "" }: { count?: number; className?: string }) {
  const microbes = useMemo<Microbe[]>(() => {
    const types: Microbe["type"][] = ["coccus", "bacillus", "spirillum", "dna"];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: types[i % types.length],
      size: 20 + (i * 7) % 20,
      x: (i * 17 + 5) % 90,
      y: (i * 23 + 10) % 80,
      delay: i * 1.2,
      duration: 12 + (i * 3) % 10,
      opacity: 0.4 + (i % 3) * 0.15,
    }));
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {microbes.map((m) => (
        <div
          key={m.id}
          className="absolute animate-floating-microbe"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            opacity: m.opacity,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        >
          <MicrobeShape type={m.type} size={m.size} />
        </div>
      ))}
    </div>
  );
}
