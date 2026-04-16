import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FloatingMicrobes } from "@/components/FloatingMicrobes";
import { FlaskConical, Home, Microscope, Dna, Bug } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <FloatingMicrobes count={12} />

      <div className="text-center relative z-10 p-8 max-w-lg">
        {/* Animated Petri dish */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
          className="relative mx-auto mb-8 h-44 w-44"
        >
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 bg-card/50" />
          <div className="absolute inset-3 rounded-full border border-primary/10 border-dashed" />
          <div className="absolute inset-6 rounded-full border border-accent/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Microscope className="h-14 w-14 text-primary/25" />
          </div>
          {/* Animated colony dots */}
          {[
            { top: "12%", left: "20%", size: "h-3 w-3", color: "bg-primary/25", delay: 0 },
            { top: "25%", right: "18%", size: "h-2 w-2", color: "bg-accent/25", delay: 0.5 },
            { bottom: "20%", left: "28%", size: "h-2.5 w-2.5", color: "bg-primary/20", delay: 1 },
            { bottom: "15%", right: "22%", size: "h-2 w-2", color: "bg-accent/20", delay: 1.5 },
            { top: "45%", left: "12%", size: "h-1.5 w-1.5", color: "bg-primary/15", delay: 2 },
            { top: "55%", right: "14%", size: "h-1.5 w-1.5", color: "bg-accent/15", delay: 2.5 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5 + dot.delay * 0.3, duration: 0.6 }}
              className={`absolute ${dot.size} rounded-full ${dot.color} animate-pulse`}
              style={{ top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom, animationDelay: `${dot.delay}s` }}
            />
          ))}
          {/* DNA strand accent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -right-4 top-1/4"
          >
            <Dna className="h-8 w-8 text-accent/15 animate-floating-microbe" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -left-3 bottom-1/4"
          >
            <Bug className="h-6 w-6 text-primary/15 animate-floating-microbe" style={{ animationDelay: "3s" }} />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-mono text-primary/70 mb-2 tracking-[0.2em] uppercase"
        >
          Specimen Not Found
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-7xl font-bold font-heading mb-3 text-gradient"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-muted-foreground mb-1"
        >
          No cultures detected at this location
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-muted-foreground/60 mb-8 max-w-sm mx-auto"
        >
          The sample you're looking for may have been transferred, contaminated, or doesn't exist in our laboratory database.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3 justify-center"
        >
          <Button asChild>
            <Link to="/"><Home className="h-4 w-4 mr-2" /> Return to Lab</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/research"><FlaskConical className="h-4 w-4 mr-2" /> View Research</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
