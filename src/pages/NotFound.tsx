import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FloatingMicrobes } from "@/components/FloatingMicrobes";
import { FlaskConical, Home, Microscope } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <FloatingMicrobes count={10} />

      <div className="text-center relative z-10 p-8 max-w-lg">
        {/* Petri dish illustration */}
        <div className="relative mx-auto mb-8 h-40 w-40">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 bg-card/50" />
          <div className="absolute inset-3 rounded-full border border-primary/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Microscope className="h-16 w-16 text-primary/30" />
          </div>
          {/* Scattered "colonies" */}
          <div className="absolute top-6 left-8 h-3 w-3 rounded-full bg-primary/20 animate-pulse" />
          <div className="absolute top-10 right-7 h-2 w-2 rounded-full bg-accent/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-8 left-12 h-2.5 w-2.5 rounded-full bg-primary/15 animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-6 right-10 h-2 w-2 rounded-full bg-accent/15 animate-pulse" style={{ animationDelay: "1.5s" }} />
        </div>

        <p className="text-sm font-mono text-primary mb-2 tracking-wider uppercase">Specimen Not Found</p>
        <h1 className="text-7xl font-bold font-heading mb-2 text-gradient">404</h1>
        <p className="text-lg text-muted-foreground mb-2">
          No cultures detected at this location
        </p>
        <p className="text-sm text-muted-foreground/70 mb-8">
          The sample you're looking for may have been moved or doesn't exist in our lab database.
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
