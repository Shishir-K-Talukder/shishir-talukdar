import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FloatingMicrobes } from "@/components/FloatingMicrobes";
import { FlaskConical, Home, Microscope, Dna, Bug } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <FloatingMicrobes count={12} />

      <div className="text-center relative z-10 p-8 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Petri dish */}
        <div className="relative mx-auto mb-8 h-44 w-44 animate-in zoom-in-75 duration-700">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 bg-card/50" />
          <div className="absolute inset-3 rounded-full border border-primary/10 border-dashed" />
          <div className="absolute inset-6 rounded-full border border-accent/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Microscope className="h-14 w-14 text-primary/25" />
          </div>
          <div className="absolute -right-4 top-1/4">
            <Dna className="h-8 w-8 text-accent/15 animate-floating-microbe" />
          </div>
          <div className="absolute -left-3 bottom-1/4">
            <Bug className="h-6 w-6 text-primary/15 animate-floating-microbe" style={{ animationDelay: "3s" }} />
          </div>
        </div>

        <p className="text-xs font-mono text-primary/70 mb-2 tracking-[0.2em] uppercase">
          Specimen Not Found
        </p>

        <h1 className="text-7xl font-bold font-heading mb-3 text-gradient">
          404
        </h1>

        <p className="text-lg text-muted-foreground mb-1">
          No cultures detected at this location
        </p>

        <p className="text-sm text-muted-foreground/60 mb-8 max-w-sm mx-auto">
          The sample you're looking for may have been transferred, contaminated, or doesn't exist in our laboratory database.
        </p>

        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link to="/"><Home className="h-4 w-4 mr-2" /> Return to Lab</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/research"><FlaskConical className="h-4 w-4 mr-2" /> View Research</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
