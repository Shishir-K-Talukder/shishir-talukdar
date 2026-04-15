import { useState, useEffect } from "react";
import { useSiteMetadata, useUpdateMetadata } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

const PAGES = ["home", "research", "publications", "collaborations", "about", "contact"];

export default function SEOEditor() {
  const { data: allMeta, isLoading } = useSiteMetadata();
  const update = useUpdateMetadata();
  const { toast } = useToast();
  const [forms, setForms] = useState<Record<string, any>>({});

  useEffect(() => {
    if (Array.isArray(allMeta)) {
      const map: Record<string, any> = {};
      allMeta.forEach((m: any) => { map[m.page] = m; });
      setForms(map);
    }
  }, [allMeta]);

  const handleChange = (page: string, field: string, value: string) => {
    setForms((prev) => ({
      ...prev,
      [page]: { ...prev[page], [field]: value, page },
    }));
  };

  const handleSave = async (page: string) => {
    const form = forms[page];
    if (!form) return;
    try {
      await update.mutateAsync({
        page,
        title: form.title || "",
        description: form.description || "",
        og_title: form.og_title || "",
        og_description: form.og_description || "",
        og_image: form.og_image || "",
        keywords: form.keywords || "",
      });
      toast({ title: "Saved", description: `SEO for "${page}" updated.` });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold">SEO & Metadata</h2>
      {PAGES.map((page) => {
        const form = forms[page] || {};
        return (
          <Card key={page}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg capitalize">{page}</CardTitle>
              <Button size="sm" onClick={() => handleSave(page)} disabled={update.isPending}>
                {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-1" /> Save</>}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Page Title</Label>
                <Input value={form.title || ""} onChange={(e) => handleChange(page, "title", e.target.value)} />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea value={form.description || ""} onChange={(e) => handleChange(page, "description", e.target.value)} rows={2} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>OG Title</Label>
                  <Input value={form.og_title || ""} onChange={(e) => handleChange(page, "og_title", e.target.value)} />
                </div>
                <div>
                  <Label>OG Description</Label>
                  <Input value={form.og_description || ""} onChange={(e) => handleChange(page, "og_description", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>OG Image URL</Label>
                  <Input value={form.og_image || ""} onChange={(e) => handleChange(page, "og_image", e.target.value)} />
                </div>
                <div>
                  <Label>Keywords (comma-separated)</Label>
                  <Input value={form.keywords || ""} onChange={(e) => handleChange(page, "keywords", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
