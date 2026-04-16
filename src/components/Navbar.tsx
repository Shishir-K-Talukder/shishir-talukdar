import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SktLogo } from "@/components/SktLogo";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/research", label: "Research" },
  { to: "/publications", label: "Publications" },
  { to: "/collaborations", label: "Collaborations" },
  { to: "/blog", label: "Blog", hasDropdown: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [blogDropdown, setBlogDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBlogDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
          <Link to="/" className="flex items-center gap-2 group">
            <SktLogo className="h-8 w-8 shrink-0" />
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              Shishir K. Talukder
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-full border border-border/50 bg-card/50 backdrop-blur-md px-1.5 py-1">
              {navLinks.map((l) => (
                l.hasDropdown ? (
                  <div key={l.to} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setBlogDropdown(!blogDropdown)}
                      className={cn(
                        "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-300 flex items-center gap-1",
                        pathname.startsWith("/blog")
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {pathname.startsWith("/blog") && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-primary/15 border border-primary/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{l.label}</span>
                      <ChevronDown className={cn("h-3 w-3 relative z-10 transition-transform", blogDropdown && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {blogDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl p-2"
                        >
                          <Link
                            to="/blog"
                            onClick={() => setBlogDropdown(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
                          >
                            All Posts
                          </Link>
                          {categories.length > 0 && (
                            <div className="h-px bg-border/40 my-1" />
                          )}
                          {categories.map(cat => (
                            <Link
                              key={cat.id}
                              to={`/blog?category=${cat.id}`}
                              onClick={() => setBlogDropdown(false)}
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                            >
                              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
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
                )
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

      {/* Mobile overlay */}
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
                      pathname === l.to || (l.hasDropdown && pathname.startsWith("/blog"))
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                  {/* Mobile blog categories */}
                  {l.hasDropdown && categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-1 mb-2">
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/blog?category=${cat.id}`}
                          onClick={() => setOpen(false)}
                          className="text-xs text-muted-foreground hover:text-primary px-3 py-1 rounded-full border border-border/30"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
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
