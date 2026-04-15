import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BentoCard } from "@/components/BentoCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

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

  const { data: ads = [] } = useQuery({
    queryKey: ["ad-placements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ad_placements").select("*").eq("enabled", true);
      if (error) throw error;
      return data;
    },
  });

  const sidebarAd = ads.find(a => a.position === "sidebar");
  const bottomAd = ads.find(a => a.position === "bottom");

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">Blog</h1>
        <p className="text-muted-foreground max-w-2xl">
          Insights, discoveries, and reflections from the world of microbiology research.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {isLoading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)
          ) : posts.length === 0 ? (
            <BentoCard className="p-8 text-center text-muted-foreground">No blog posts yet.</BentoCard>
          ) : (
            posts.map((post, i) => (
              <div key={post.id}>
                <Link to={`/blog/${post.slug}`}>
                  <BentoCard className="group overflow-hidden hover:border-primary/40 transition-all">
                    <div className="flex flex-col md:flex-row gap-4 p-5">
                      {post.cover_image_url && (
                        <img src={post.cover_image_url} alt={post.title}
                          className="w-full md:w-40 h-32 object-cover rounded-xl shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
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
                            {post.tags.map(t => (
                              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 self-center hidden md:block" />
                    </div>
                  </BentoCard>
                </Link>
                {/* Inline ad after first post */}
                {i === 0 && ads.find(a => a.position === "inline") && (
                  <div className="my-4">
                    <AdUnit adClient={ads.find(a => a.position === "inline")!.ad_client} adSlot={ads.find(a => a.position === "inline")!.ad_slot} />
                  </div>
                )}
              </div>
            ))
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
          <BentoCard className="p-5">
            <h3 className="font-heading font-bold text-sm mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {[...new Set(posts.flatMap(p => p.tags || []))].slice(0, 10).map(t => (
                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
              ))}
            </div>
          </BentoCard>
        </aside>
      </div>
    </div>
  );
}
