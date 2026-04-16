import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon_name: string;
  sort_order: number;
};

const emptyCategory = { name: "", slug: "", description: "", color: "#3B82F6", icon_name: "Tag", sort_order: 0 };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CategoriesEditor() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyCategory);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_categories").select("*").order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  const save = useMutation({
    mutationFn: async (c: typeof emptyCategory & { id?: string }) => {
      const payload = { ...c, slug: c.slug || slugify(c.name) };
      if (c.id) {
        const { error } = await supabase.from("blog_categories").update(payload).eq("id", c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); setOpen(false); toast.success("Category saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => { setEditing(null); setForm(emptyCategory); setOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm(c); setOpen(true); };

  const colorPresets = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#F97316"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold">Categories</h2>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" /> New Category</Button>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading…</p> : categories.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No categories yet.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {categories.map(c => (
            <Card key={c.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <CardTitle className="text-sm truncate">{c.name}</CardTitle>
                    <span className="text-xs text-muted-foreground">/{c.slug}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => del.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-from-name" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex items-center gap-2 mt-1">
                {colorPresets.map(color => (
                  <button
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    className="h-7 w-7 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: color,
                      borderColor: form.color === color ? "white" : "transparent",
                      transform: form.color === color ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ))}
                <Input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-24 h-7 text-xs ml-2" />
              </div>
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate({ ...form, ...(editing ? { id: editing.id } : {}) })} disabled={!form.name || save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
