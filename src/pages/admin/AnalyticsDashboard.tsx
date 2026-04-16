import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Users, Eye, Clock, Globe, Monitor, Smartphone, Tablet, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type PageView = {
  id: string;
  page_path: string;
  referrer: string;
  country: string;
  city: string;
  device_type: string;
  browser: string;
  session_id: string;
  blog_post_id: string | null;
  created_at: string;
};

type TimeRange = "7d" | "30d" | "90d";

function getDateRange(range: TimeRange) {
  const now = new Date();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const from = new Date(now.getTime() - days * 86400000);
  return { from: from.toISOString(), days };
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<TimeRange>("30d");
  const { from, days } = getDateRange(range);

  const { data: views = [], isLoading } = useQuery({
    queryKey: ["analytics-views", range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", from)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PageView[];
    },
  });

  // Previous period for comparison
  const prevFrom = new Date(new Date(from).getTime() - days * 86400000).toISOString();
  const { data: prevViews = [] } = useQuery({
    queryKey: ["analytics-prev", range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("id, session_id")
        .gte("created_at", prevFrom)
        .lt("created_at", from);
      if (error) throw error;
      return data as { id: string; session_id: string }[];
    },
  });

  const stats = useMemo(() => {
    const totalViews = views.length;
    const uniqueSessions = new Set(views.filter(v => v.session_id).map(v => v.session_id)).size;
    const prevTotal = prevViews.length;
    const prevUnique = new Set(prevViews.filter(v => v.session_id).map(v => v.session_id)).size;

    const viewsChange = prevTotal > 0 ? ((totalViews - prevTotal) / prevTotal * 100) : 0;
    const sessionsChange = prevUnique > 0 ? ((uniqueSessions - prevUnique) / prevUnique * 100) : 0;

    // Popular pages
    const pageCounts: Record<string, number> = {};
    views.forEach(v => { pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1; });
    const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Referrers
    const refCounts: Record<string, number> = {};
    views.forEach(v => {
      if (!v.referrer) return;
      try {
        const host = new URL(v.referrer).hostname.replace("www.", "");
        refCounts[host] = (refCounts[host] || 0) + 1;
      } catch {
        if (v.referrer) refCounts[v.referrer] = (refCounts[v.referrer] || 0) + 1;
      }
    });
    const directCount = views.filter(v => !v.referrer).length;
    const topReferrers = [
      ...(directCount > 0 ? [["Direct", directCount] as [string, number]] : []),
      ...Object.entries(refCounts).sort((a, b) => b[1] - a[1]).slice(0, 8),
    ];

    // Countries
    const countryCounts: Record<string, number> = {};
    views.forEach(v => {
      if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Devices
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
    views.forEach(v => {
      const dt = v.device_type as keyof typeof deviceCounts;
      if (dt in deviceCounts) deviceCounts[dt]++;
    });

    // Browsers
    const browserCounts: Record<string, number> = {};
    views.forEach(v => {
      if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1;
    });
    const topBrowsers = Object.entries(browserCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Daily views for chart
    const dailyCounts: Record<string, number> = {};
    views.forEach(v => {
      const day = v.created_at.slice(0, 10);
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });
    const dailyData = Object.entries(dailyCounts).sort((a, b) => a[0].localeCompare(b[0]));

    // Blog post views
    const blogViews = views.filter(v => v.page_path.startsWith("/blog/"));
    const blogPathCounts: Record<string, number> = {};
    blogViews.forEach(v => { blogPathCounts[v.page_path] = (blogPathCounts[v.page_path] || 0) + 1; });
    const topBlogPosts = Object.entries(blogPathCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      totalViews, uniqueSessions, viewsChange, sessionsChange,
      topPages, topReferrers, topCountries, deviceCounts, topBrowsers,
      dailyData, topBlogPosts,
    };
  }, [views, prevViews]);

  const deviceTotal = stats.deviceCounts.desktop + stats.deviceCounts.mobile + stats.deviceCounts.tablet;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">Analytics</h2>
        <Select value={range} onValueChange={(v) => setRange(v as TimeRange)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading analytics…</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard title="Page Views" value={stats.totalViews} change={stats.viewsChange} icon={Eye} />
            <StatCard title="Unique Visitors" value={stats.uniqueSessions} change={stats.sessionsChange} icon={Users} />
            <StatCard title="Blog Views" value={views.filter(v => v.page_path.startsWith("/blog")).length} icon={FileText} />
            <StatCard title="Countries" value={stats.topCountries.length} icon={Globe} />
          </div>

          {/* Mini bar chart */}
          {stats.dailyData.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Daily Views</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-end gap-px h-24">
                  {stats.dailyData.map(([day, count]) => {
                    const max = Math.max(...stats.dailyData.map(d => d[1] as number));
                    const h = max > 0 ? ((count as number) / max) * 100 : 0;
                    return (
                      <div key={day} className="flex-1 group relative" title={`${day}: ${count} views`}>
                        <div className="bg-primary/60 hover:bg-primary rounded-t-sm transition-colors" style={{ height: `${h}%`, minHeight: count ? 2 : 0 }} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                  <span>{stats.dailyData[0]?.[0]}</span>
                  <span>{stats.dailyData[stats.dailyData.length - 1]?.[0]}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Pages */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Top Pages</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {stats.topPages.map(([path, count]) => (
                    <div key={path} className="flex items-center justify-between text-xs">
                      <span className="truncate mr-2 text-foreground">{path}</span>
                      <span className="text-muted-foreground font-mono shrink-0">{count}</span>
                    </div>
                  ))}
                  {stats.topPages.length === 0 && <p className="text-xs text-muted-foreground">No data yet</p>}
                </div>
              </CardContent>
            </Card>

            {/* Referrers */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {stats.topReferrers.map(([ref, count]) => (
                    <div key={ref} className="flex items-center justify-between text-xs">
                      <span className="truncate mr-2 text-foreground">{ref}</span>
                      <span className="text-muted-foreground font-mono shrink-0">{count}</span>
                    </div>
                  ))}
                  {stats.topReferrers.length === 0 && <p className="text-xs text-muted-foreground">No data yet</p>}
                </div>
              </CardContent>
            </Card>

            {/* Countries */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Top Countries</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {stats.topCountries.map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{country || "Unknown"}</span>
                      <span className="text-muted-foreground font-mono shrink-0">{count}</span>
                    </div>
                  ))}
                  {stats.topCountries.length === 0 && <p className="text-xs text-muted-foreground">No geo data yet</p>}
                </div>
              </CardContent>
            </Card>

            {/* Devices & Browsers */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Devices & Browsers</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-4">
                <div className="space-y-2">
                  <DeviceRow icon={Monitor} label="Desktop" count={stats.deviceCounts.desktop} total={deviceTotal} />
                  <DeviceRow icon={Smartphone} label="Mobile" count={stats.deviceCounts.mobile} total={deviceTotal} />
                  <DeviceRow icon={Tablet} label="Tablet" count={stats.deviceCounts.tablet} total={deviceTotal} />
                </div>
                <div className="border-t border-border/40 pt-3 space-y-1.5">
                  {stats.topBrowsers.map(([browser, count]) => (
                    <div key={browser} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{browser}</span>
                      <span className="text-muted-foreground font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Blog Posts */}
          {stats.topBlogPosts.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">Popular Blog Posts</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-2">
                  {stats.topBlogPosts.map(([path, count], i) => (
                    <div key={path} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground font-mono w-4">{i + 1}.</span>
                        <span className="truncate text-foreground">{path.replace("/blog/", "")}</span>
                      </span>
                      <span className="text-muted-foreground font-mono shrink-0">{count} views</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon }: { title: string; value: number; change?: number; icon: any }) {
  const up = (change ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{title}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold font-mono">{value.toLocaleString()}</div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-0.5 text-xs mt-1", up ? "text-primary" : "text-destructive")}>
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(change).toFixed(1)}% vs prev period
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DeviceRow({ icon: Icon, label, count, total }: { icon: any; label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total * 100).toFixed(1) : "0";
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-foreground w-16">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-muted-foreground font-mono w-12 text-right">{pct}%</span>
    </div>
  );
}
