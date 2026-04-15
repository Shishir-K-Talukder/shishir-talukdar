import { useState } from "react";
import { useSiteImages, useUploadImage, useDeleteImage } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

const CATEGORIES = [
  { value: "profile", label: "Profile Picture" },
  { value: "hero", label: "Hero/Banner" },
  { value: "research", label: "Research" },
  { value: "general", label: "General" },
];

export default function ImageManager() {
  const { data: images, isLoading } = useSiteImages();
  const upload = useUploadImage();
  const deleteImg = useDeleteImage();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState("general");
  const [filterCategory, setFilterCategory] = useState("all");

  const handleUpload = async () => {
    if (!file || !name) {
      toast({ title: "Missing fields", description: "Provide a file and name.", variant: "destructive" });
      return;
    }
    try {
      await upload.mutateAsync({ file, name, altText, category });
      toast({ title: "Uploaded", description: `${name} uploaded successfully.` });
      setFile(null);
      setName("");
      setAltText("");
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, url: string, imgName: string) => {
    if (!confirm(`Delete "${imgName}"?`)) return;
    try {
      await deleteImg.mutateAsync({ id, url });
      toast({ title: "Deleted", description: `${imgName} removed.` });
    } catch {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const filtered = filterCategory === "all" ? images : images?.filter((i) => i.category === filterCategory);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold">Image Manager</h2>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Image name" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Descriptive alt text" />
          </div>
          <div>
            <Label>File</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <Button onClick={handleUpload} disabled={upload.isPending || !file}>
            {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
            Upload
          </Button>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Label>Filter:</Label>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gallery */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <Card key={img.id} className="overflow-hidden group relative">
              <div className="aspect-square bg-muted">
                <img src={img.url} alt={img.alt_text || img.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{img.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{img.category}</p>
              </CardContent>
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => handleDelete(img.id, img.url, img.name)}
                disabled={deleteImg.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
            <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
            No images uploaded yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
