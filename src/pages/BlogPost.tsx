import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BentoCard } from "@/components/BentoCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

declare global {
  interface Window { adsbygoogle: unknown[] }
}

function AdUnit({ adClient, adSlot }: { adClient: string; adSlot: string }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);
  if (!adClient || !adSlot) return null;
  return (
    <ins className="adsbygoogle" style={{ display: "block" }}
      data-ad-client={adClient} data-ad-slot={adSlot} data-ad-format="auto" data-full-width-responsive="true" />
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
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

  if (isLoading) {
    return (
      <div className="container py-12 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-64 rounded-2xl mb-6" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  const seoTitle = (post as any).seo_title || post.title;
  const metaDesc = (post as any).meta_description || post.excerpt;
  const canonicalUrl = (post as any).canonical_url || "";
  const pageUrl = `${window.location.origin}/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDesc} />
        {(post as any).focus_keyword && <meta name="keywords" content={(post as any).focus_keyword} />}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl || pageUrl} />
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: seoTitle,
            description: metaDesc,
            image: post.cover_image_url || undefined,
            datePublished: post.published_at,
            url: pageUrl,
            author: { "@type": "Person", name: "Shishir Kumar Talukder" },
          })}
        </script>
      </Helmet>

      <div className="container py-12 md:py-20">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <article className="min-w-0">
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt={seoTitle}
                className="w-full h-48 md:h-72 object-cover rounded-2xl mb-8" loading="lazy" />
            )}

            <h1 className="text-2xl md:text-4xl font-heading font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {Math.max(1, Math.ceil((post.content?.length || 0) / 1000))} min read
              </span>
            </div>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-8">
                {post.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
            )}

            <div
              className="prose prose-invert max-w-none prose-headings:font-heading prose-a:text-primary prose-img:rounded-xl prose-table:border-collapse prose-td:border prose-td:border-border prose-td:p-2 prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/30"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {bottomAd && (
              <div className="mt-12">
                <AdUnit adClient={bottomAd.ad_client} adSlot={bottomAd.ad_slot} />
              </div>
            )}
          </article>

          <aside className="hidden lg:block space-y-6">
            {sidebarAd && (
              <BentoCard className="p-4 sticky top-20">
                <AdUnit adClient={sidebarAd.ad_client} adSlot={sidebarAd.ad_slot} />
              </BentoCard>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
