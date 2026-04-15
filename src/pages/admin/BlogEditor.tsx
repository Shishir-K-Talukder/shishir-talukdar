import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar as CalendarIcon } from "lucide-react";
import { ImagePicker } from "@/components/ImagePicker";
import { RichTextEditor } from "@/components/RichTextEditor";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
};

const emptyPost: Omit<BlogPost, "id"> = {
  title: "", slug: "", content: "", excerpt: "",
  cover_image_url: null, tags: [], published: false, published_at: null,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogEditor() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyPost);
  const [tagsInput, setTagsInput] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Omit<BlogPost, "id"> & { id?: string }) => {
      const publishedAt = scheduledDate
        ? scheduledDate.toISOString()
        : p.published && !p.published_at
        ? new Date().toISOString()
        : p.published_at;

      const payload = { ...p, published_at: publishedAt };
      if (p.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { id: _, ...rest } = payload as any;
        const { error } = await supabase.from("blog_posts").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); setOpen(false); toast.success("Post saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast.success("Post deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => {
    setEditing(null);
    setForm(emptyPost);
    setTagsInput("");
    setScheduledDate(undefined);
    setOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm(p);
    setTagsInput(p.tags.join(", "));
    setScheduledDate(p.published_at ? new Date(p.published_at) : undefined);
    setOpen(true);
  };

  const handleSave = () => {
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const slug = form.slug || slugify(form.title);
    save.mutate({ ...form, tags, slug, ...(editing ? { id: editing.id } : {}) });
  };

  const wordCount = form.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold">Blog Posts</h2>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" /> New Post</Button>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading…</p> : posts.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No blog posts yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <Card key={p.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {p.published ? <Eye className="h-4 w-4 text-primary shrink-0" /> : <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />}
                    <CardTitle className="text-sm truncate">{p.title}</CardTitle>
                    {p.published && <Badge variant="secondary" className="text-xs shrink-0">Published</Badge>}
                    {p.published_at && new Date(p.published_at) > new Date() && (
                      <Badge variant="outline" className="text-xs shrink-0 border-primary/40 text-primary">Scheduled</Badge>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => del.mutate(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />
              </div>
            </div>

            <div>
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short summary for blog listing…" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Content</Label>
                <span className="text-xs text-muted-foreground">{wordCount} words</span>
              </div>
              <RichTextEditor
                content={form.content}
                onChange={val => setForm({ ...form, content: val })}
                placeholder="Start writing your blog post..."
              />
            </div>

            <ImagePicker value={form.cover_image_url} onChange={url => setForm({ ...form, cover_image_url: url })} label="Cover Image" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="microbiology, research, AMR" />
              </div>
              <div>
                <Label>Schedule Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !scheduledDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date (optional)"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={v => setForm({ ...form, published: v })} />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title || save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
