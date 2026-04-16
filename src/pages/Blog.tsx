import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link, useSearchParams } from "react-router-dom";
import { BentoCard } from "@/components/BentoCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowRight, TrendingUp, Newspaper, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

declare global {
  interface Window { adsbygoogle: unknown[] }
}

function AdUnit({ adClient, adSlot, className }: { adClient: string; adSlot: string; className?: string }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  if (!adClient || !adSlot) return null;
  return (
    <ins className={`adsbygoogle ${className || ""}`} style={{ display: "block" }}
      data-ad-client={adClient} data-ad-slot={adSlot} data-ad-format="auto" data-full-width-responsive="true" />
  );
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: ads = [] } = useQuery({
    queryKey: ["ad-placements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ad_placements").select("*").eq("enabled", true);
      if (error) throw error;
      return data;
    },
  });

  const filteredPosts = activeCategory === "all"
    ? posts
    : posts.filter(p => (p as any).category_id === activeCategory);

  const sidebarAd = ads.find(a => a.position === "sidebar");
  const bottomAd = ads.find(a => a.position === "bottom");

  // Find trending post (most recent)
  const trendingPost = posts[0];

  return (
    <div className="min-w-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/30 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container py-14 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Newspaper className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">Research Blog</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4 leading-tight">
              Insights from the
              <span className="text-primary"> Microscopic World</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
              Discoveries, methodologies, and reflections from the frontiers of microbiology research. Stay updated with the latest in antimicrobial resistance, biotechnology, and lab innovations.
            </p>
          </motion.div>

          {/* Trending Post Card */}
          {trendingPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <Link to={`/blog/${trendingPost.slug}`}>
                <div className="group relative rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm p-5 md:p-6 hover:border-primary/40 transition-all max-w-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Latest Post</span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    {trendingPost.cover_image_url && (
                      <img src={trendingPost.cover_image_url} alt={trendingPost.title}
                        className="w-full md:w-48 h-32 object-cover rounded-xl shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {trendingPost.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">{trendingPost.excerpt}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {trendingPost.published_at && new Date(trendingPost.published_at).toLocaleDateString()}
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-14 z-20">
        <div className="container">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            <button
              onClick={() => setSearchParams({})}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                All Posts
              </span>
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            {isLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)
            ) : filteredPosts.length === 0 ? (
              <BentoCard className="p-8 text-center text-muted-foreground">
                {activeCategory === "all" ? "No blog posts yet." : "No posts in this category."}
              </BentoCard>
            ) : (
              filteredPosts.map((post, i) => {
                const postCategory = categories.find(c => c.id === (post as any).category_id);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link to={`/blog/${post.slug}`}>
                      <BentoCard className="group overflow-hidden hover:border-primary/40 transition-all">
                        <div className="flex flex-col md:flex-row gap-4 p-5">
                          {post.cover_image_url && (
                            <img src={post.cover_image_url} alt={post.title}
                              className="w-full md:w-44 h-32 object-cover rounded-xl shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            {postCategory && (
                              <span
                                className="inline-block text-[11px] font-semibold uppercase tracking-wider mb-2 px-2 py-0.5 rounded-md"
                                style={{ backgroundColor: postCategory.color + "20", color: postCategory.color }}
                              >
                                {postCategory.name}
                              </span>
                            )}
                            <h2 className="text-lg font-heading font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h2>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {post.published_at && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.published_at).toLocaleDateString()}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Math.max(1, Math.ceil((post.content?.length || 0) / 1000))} min read
                              </span>
                            </div>
                            {post.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {post.tags.slice(0, 4).map(t => (
                                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 self-center hidden md:block" />
                        </div>
                      </BentoCard>
                    </Link>
                    {i === 0 && ads.find(a => a.position === "inline") && (
                      <div className="my-4">
                        <AdUnit adClient={ads.find(a => a.position === "inline")!.ad_client} adSlot={ads.find(a => a.position === "inline")!.ad_slot} />
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}

            {bottomAd && (
              <div className="mt-8">
                <AdUnit adClient={bottomAd.ad_client} adSlot={bottomAd.ad_slot} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {sidebarAd && (
              <BentoCard className="p-4">
                <AdUnit adClient={sidebarAd.ad_client} adSlot={sidebarAd.ad_slot} />
              </BentoCard>
            )}

            {/* Categories Card */}
            <BentoCard className="p-5">
              <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map(cat => {
                  const count = posts.filter(p => (p as any).category_id === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSearchParams({ category: cat.id })}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        activeCategory === cat.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                      <span className="text-xs">{count}</span>
                    </button>
                  );
                })}
              </div>
            </BentoCard>

            {/* Tags */}
            <BentoCard className="p-5">
              <h3 className="font-heading font-bold text-sm mb-3 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[...new Set(posts.flatMap(p => p.tags || []))].slice(0, 10).map(t => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
            </BentoCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
