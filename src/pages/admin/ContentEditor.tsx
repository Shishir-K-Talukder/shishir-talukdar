import { useState } from "react";
import { useSiteContent, useUpsertContent } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SECTIONS = [
  { value: "hero", label: "Hero Section" },
  { value: "about", label: "About" },
  { value: "research", label: "Research" },
  { value: "publications", label: "Publications" },
  { value: "collaborations", label: "Collaborations" },
  { value: "contact", label: "Contact" },
  { value: "footer", label: "Footer" },
  { value: "stats", label: "Statistics" },
];

export default function ContentEditor() {
  const { data: content, isLoading } = useSiteContent();
  const upsert = useUpsertContent();
  const { toast } = useToast();
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [newItem, setNewItem] = useState({ section: "", key: "", value: "" });
  const [showNew, setShowNew] = useState(false);

  const handleSave = async (section: string, key: string) => {
    const editKey = `${section}:${key}`;
    const value = editValues[editKey];
    if (value === undefined) return;
    try {
      await upsert.mutateAsync({ section, key, value });
      toast({ title: "Saved", description: `${section}/${key} updated.` });
      setEditValues((prev) => {
        const next = { ...prev };
        delete next[editKey];
        return next;
      });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  const handleAddNew = async () => {
    if (!newItem.section || !newItem.key) return;
    try {
      await upsert.mutateAsync({ section: newItem.section, key: newItem.key, value: newItem.value });
      toast({ title: "Added", description: `${newItem.section}/${newItem.key} created.` });
      setNewItem({ section: "", key: "", value: "" });
      setShowNew(false);
    } catch {
      toast({ title: "Error", description: "Failed to add.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  const grouped = (content || []).reduce((acc, item) => {
    (acc[item.section] = acc[item.section] || []).push(item);
    return acc;
  }, {} as Record<string, typeof content>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold">Site Content</h2>
        <Button size="sm" onClick={() => setShowNew(!showNew)}>
          <Plus className="h-4 w-4 mr-1" /> Add Content
        </Button>
      </div>

      {showNew && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Section</Label>
                <Select value={newItem.section} onValueChange={(v) => setNewItem((p) => ({ ...p, section: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Key</Label>
                <Input value={newItem.key} onChange={(e) => setNewItem((p) => ({ ...p, key: e.target.value }))} placeholder="e.g. headline" />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddNew} disabled={upsert.isPending} className="w-full">
                  {upsert.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                </Button>
              </div>
            </div>
            <div>
              <Label>Value</Label>
              <Textarea value={newItem.value} onChange={(e) => setNewItem((p) => ({ ...p, value: e.target.value }))} rows={3} />
            </div>
          </CardContent>
        </Card>
      )}

      {Object.entries(grouped).map(([section, items]) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle className="text-lg capitalize">{section}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items!.map((item) => {
              const editKey = `${item.section}:${item.key}`;
              const currentValue = editValues[editKey] ?? item.value;
              const isDirty = editValues[editKey] !== undefined && editValues[editKey] !== item.value;
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-mono text-muted-foreground">{item.key}</Label>
                    {isDirty && (
                      <Button size="sm" variant="ghost" onClick={() => handleSave(item.section, item.key)} disabled={upsert.isPending}>
                        <Save className="h-3 w-3 mr-1" /> Save
                      </Button>
                    )}
                  </div>
                  {currentValue.length > 100 ? (
                    <Textarea
                      value={currentValue}
                      onChange={(e) => setEditValues((p) => ({ ...p, [editKey]: e.target.value }))}
                      rows={4}
                    />
                  ) : (
                    <Input
                      value={currentValue}
                      onChange={(e) => setEditValues((p) => ({ ...p, [editKey]: e.target.value }))}
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {Object.keys(grouped).length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No content yet. Click "Add Content" to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
