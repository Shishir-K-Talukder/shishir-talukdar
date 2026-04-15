import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "h-14 bg-background/90 backdrop-blur-xl shadow-[0_1px_20px_-4px_hsl(var(--primary)/0.15)]"
            : "h-16 bg-background/60 backdrop-blur-md"
        )}
      >
        <div className="container flex h-full items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:bg-primary/30 transition-colors duration-500" />
              <img src="/favicon.png" alt="SKT Logo" className="relative h-7 w-7 rounded-full" />
            </span>
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              Shishir K. Talukder
            </span>
          </Link>

          {/* Desktop — frosted pill nav */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-md px-1.5 py-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-300",
                    pathname === l.to
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {pathname === l.to && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/15 border border-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              ))}
            </div>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-full border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Link to="/contact">Request Collaboration</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <motion.button
            className="md:hidden text-foreground relative z-50"
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-2">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-full px-8 py-3 text-lg font-medium transition-colors",
                      pathname === l.to
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.06, duration: 0.3 }}
                className="mt-4"
              >
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Link to="/contact" onClick={() => setOpen(false)}>Request Collaboration</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
