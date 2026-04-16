import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>();
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBlogDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setBlogDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setBlogDropdown(false), 200);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "h-14 bg-background/95 backdrop-blur-xl border-border/50 shadow-[0_2px_20px_-4px_hsl(var(--primary)/0.1)]"
            : "h-16 bg-background/70 backdrop-blur-md border-transparent"
        )}
      >
        <div className="container flex h-full items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <SktLogo className="h-8 w-8 shrink-0 transition-transform group-hover:scale-105" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-heading text-sm font-bold tracking-tight text-foreground">
                Shishir K. Talukder
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Microbiologist
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) =>
              l.hasDropdown ? (
                <div
                  key={l.to}
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={l.to}
                    className={cn(
                      "relative px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded-md",
                      pathname.startsWith("/blog")
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {pathname.startsWith("/blog") && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-1 -bottom-[13px] h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                    {l.label}
                    <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", blogDropdown && "rotate-180")} />
                  </Link>

                  <AnimatePresence>
                    {blogDropdown && categories.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-xl border border-border/60 bg-popover backdrop-blur-xl shadow-xl overflow-hidden"
                      >
                        <div className="p-1.5">
                          <Link
                            to="/blog"
                            onClick={() => setBlogDropdown(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
                          >
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            All Posts
                          </Link>
                          <div className="h-px bg-border/30 mx-2 my-1" />
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/blog?category=${cat.id}`}
                              onClick={() => setBlogDropdown(false)}
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                            >
                              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                              <span className="truncate">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    pathname === l.to
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {pathname === l.to && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-1 -bottom-[13px] h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  {l.label}
                </Link>
              )
            )}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Collaborate
            </Link>

            <motion.button
              className="lg:hidden text-foreground relative z-50 p-2 rounded-md hover:bg-muted/60 transition-colors"
              onClick={() => setOpen(!open)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-1 px-6">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className="w-full max-w-xs"
                >
                  {l.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setMobileBlogOpen(!mobileBlogOpen)}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-lg font-medium transition-colors",
                          pathname.startsWith("/blog")
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        {l.label}
                        <ChevronDown className={cn("h-4 w-4 transition-transform", mobileBlogOpen && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {mobileBlogOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col items-center gap-1 py-2">
                              <Link
                                to="/blog"
                                onClick={() => setOpen(false)}
                                className="text-sm text-muted-foreground hover:text-primary px-4 py-1.5 rounded-md transition-colors"
                              >
                                All Posts
                              </Link>
                              {categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  to={`/blog?category=${cat.id}`}
                                  onClick={() => setOpen(false)}
                                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary px-4 py-1.5 rounded-md transition-colors"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                  {cat.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-lg px-6 py-3 text-center text-lg font-medium transition-colors",
                        pathname === l.to
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                    >
                      {l.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.25 }}
                className="mt-4"
              >
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Request Collaboration
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
