import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";

type AdPlacement = {
  id: string;
  name: string;
  ad_client: string;
  ad_slot: string;
  enabled: boolean;
  position: string;
};

export default function AdsEditor() {
  const qc = useQueryClient();
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
        ad_client: ad.ad_client, ad_slot: ad.ad_slot, enabled: ad.enabled,
      }).eq("id", ad.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-ads"] }); toast.success("Ad placement saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const setField = (id: string, field: keyof AdPlacement, value: any) => {
    setLocal(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-heading font-bold">Google Ads Placements</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your Google AdSense ad units. Add your ad client ID (ca-pub-XXXX) and ad slot for each position.
        </p>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <div className="space-y-4">
          {local.map(ad => (
            <Card key={ad.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{ad.name} <span className="text-muted-foreground font-normal">({ad.position})</span></CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch checked={ad.enabled} onCheckedChange={v => setField(ad.id, "enabled", v)} />
                    <span className="text-xs text-muted-foreground">{ad.enabled ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4 space-y-3">
                <div>
                  <Label className="text-xs">Ad Client (ca-pub-XXXX)</Label>
                  <Input value={ad.ad_client} onChange={e => setField(ad.id, "ad_client", e.target.value)} placeholder="ca-pub-1234567890" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Ad Slot</Label>
                  <Input value={ad.ad_slot} onChange={e => setField(ad.id, "ad_slot", e.target.value)} placeholder="1234567890" className="mt-1" />
                </div>
                <Button size="sm" onClick={() => update.mutate(ad)} disabled={update.isPending}>Save</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
