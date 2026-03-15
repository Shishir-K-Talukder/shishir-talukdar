import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/research", label: "Research" },
  { to: "/publications", label: "Publications" },
  { to: "/collaborations", label: "Collaborations" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight">
          <FlaskConical className="h-5 w-5 text-primary" />
          <span>Shishir K. Talukder</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === l.to ? "text-primary" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-3">
            <Link to="/contact">Request Collaboration</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === l.to ? "text-primary" : "text-muted-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2">
              <Link to="/contact" onClick={() => setOpen(false)}>Request Collaboration</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
