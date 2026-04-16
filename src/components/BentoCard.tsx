import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  ({ children, className, delay = 0 }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
        className={cn("bento-cell", className)}
      >
        {children}
      </motion.div>
    );
  }
);

BentoCard.displayName = "BentoCard";

