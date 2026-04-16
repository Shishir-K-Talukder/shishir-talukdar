import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, Info, ExternalLink } from "lucide-react";
import { useContentValue, useUpsertContent } from "@/hooks/useSiteContent";

type AdPlacement = {
  id: string;
  name: string;
  ad_client: string;
  ad_slot: string;
  enabled: boolean;
  position: string;
};

const POSITION_LABELS: Record<string, string> = {
  sidebar: "Blog Sidebar (right column)",
  bottom: "Blog Post Bottom",
  inline: "Between Blog Posts (after 1st)",
  post_top: "Blog Post Top (above content)",
};

export default function AdsEditor() {
  const qc = useQueryClient();

  // Global AdSense publisher ID from site_content
  const { value: globalAdClient } = useContentValue("ads", "adsense_publisher_id", "");
  const { value: autoAdsEnabled } = useContentValue("ads", "auto_ads_enabled", "false");
  const upsertContent = useUpsertContent();
  const [pubId, setPubId] = useState("");
  const [autoAds, setAutoAds] = useState(false);

  useEffect(() => { setPubId(globalAdClient); }, [globalAdClient]);
  useEffect(() => { setAutoAds(autoAdsEnabled === "true"); }, [autoAdsEnabled]);

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["admin-ads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ad_placements").select("*").order("position");
      if (error) throw error;
      return data as AdPlacement[];
    },
  });

  const [local, setLocal] = useState<AdPlacement[]>([]);
  useEffect(() => { if (ads.length) setLocal(ads); }, [ads]);

  const update = useMutation({
    mutationFn: async (ad: AdPlacement) => {
      const { error } = await supabase.from("ad_placements").update({
        ad_client: ad.ad_client, ad_slot: ad.ad_slot, enabled: ad.enabled, name: ad.name,
      }).eq("id", ad.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-ads"] }); toast.success("Ad placement saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deletePlacement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ad_placements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-ads"] }); toast.success("Placement deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const setField = (id: string, field: keyof AdPlacement, value: any) => {
    setLocal(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const saveGlobalSettings = async () => {
    try {
      await upsertContent.mutateAsync({ section: "ads", key: "adsense_publisher_id", value: pubId });
      await upsertContent.mutateAsync({ section: "ads", key: "auto_ads_enabled", value: autoAds ? "true" : "false" });
      toast.success("AdSense settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-heading font-bold flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" /> Google AdSense Integration
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ads are displayed <strong>only on Blog pages</strong> (listing & individual posts). Configure your AdSense settings and ad placements below.
        </p>
      </div>

      {/* Global AdSense Settings */}
      <Card className="border-primary/20">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            AdSense Publisher Settings
            <Badge variant="secondary" className="text-[10px]">Global</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4 space-y-4">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p>Enter your AdSense Publisher ID (ca-pub-XXXX). This will load the AdSense script on blog pages.</p>
              <a href="https://www.google.com/adsense/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline mt-1">
                Get your Publisher ID <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div>
            <Label className="text-xs">Publisher ID</Label>
            <Input value={pubId} onChange={e => setPubId(e.target.value)} placeholder="ca-pub-1234567890123456" className="mt-1 font-mono text-sm" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs">Auto Ads</Label>
              <p className="text-[11px] text-muted-foreground">Let Google automatically place ads on blog pages</p>
            </div>
            <Switch checked={autoAds} onCheckedChange={setAutoAds} />
          </div>
          <Button size="sm" onClick={saveGlobalSettings} disabled={upsertContent.isPending}>Save Settings</Button>
        </CardContent>
      </Card>

      {/* Ad Placements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm">Ad Placements (Blog Only)</h3>
        </div>

        {isLoading ? <p className="text-muted-foreground text-sm">Loading…</p> : (
          <div className="space-y-3">
            {local.map(ad => (
              <Card key={ad.id} className={ad.enabled ? "border-primary/20" : ""}>
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">{ad.name}</CardTitle>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {POSITION_LABELS[ad.position] || ad.position}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch checked={ad.enabled} onCheckedChange={v => setField(ad.id, "enabled", v)} />
                        <span className="text-xs text-muted-foreground">{ad.enabled ? "Active" : "Off"}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Ad Client (ca-pub-XXXX)</Label>
                      <Input value={ad.ad_client} onChange={e => setField(ad.id, "ad_client", e.target.value)}
                        placeholder={pubId || "ca-pub-1234567890"} className="mt-1 font-mono text-sm" />
                      {!ad.ad_client && pubId && (
                        <p className="text-[10px] text-muted-foreground mt-1">Leave blank to use global Publisher ID</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs">Ad Slot ID</Label>
                      <Input value={ad.ad_slot} onChange={e => setField(ad.id, "ad_slot", e.target.value)}
                        placeholder="1234567890" className="mt-1 font-mono text-sm" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => update.mutate(ad)} disabled={update.isPending}>Save</Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm("Delete this placement?")) deletePlacement.mutate(ad.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {local.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No ad placements found. They will be created automatically.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Help section */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-2">
          <p className="font-medium text-foreground text-sm">How it works</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Sidebar</strong> — Sticky ad in the right column of blog pages (desktop only)</li>
            <li><strong>Bottom</strong> — Ad after blog post content</li>
            <li><strong>Inline</strong> — Ad between blog post cards on the listing page</li>
            <li><strong>Post Top</strong> — Ad above the blog post content</li>
            <li>Ads only appear on <strong>/blog</strong> and <strong>/blog/:slug</strong> pages</li>
            <li>Auto Ads lets Google decide additional placements on blog pages</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
