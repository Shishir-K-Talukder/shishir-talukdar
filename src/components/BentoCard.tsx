import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  ({ children, className, delay = 0 }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "-50px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={(node) => {
          (innerRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        className={cn(
          "bento-cell transition-all duration-500 ease-out",
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-[0.95]",
          className
        )}
        style={{ transitionDelay: `${delay}s` }}
      >
        {children}
      </div>
    );
  }
);

BentoCard.displayName = "BentoCard";
