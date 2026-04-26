import { useEffect, useState } from "react";
import { useSiteImages, useUploadImage } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Upload, Loader2, Check, FolderGit2 } from "lucide-react";
import { toast } from "sonner";

interface ImagePickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export function ImagePicker({ value, onChange, label = "Image" }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const { data: images = [] } = useSiteImages();
  const upload = useUploadImage();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [repoImages, setRepoImages] = useState<Array<{ name: string; file: string; alt?: string; category?: string }>>([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);

  const baseUrl = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const repoBase = `${baseUrl}/uploads`;

  useEffect(() => {
    if (!open) return;
    setRepoLoading(true);
    setRepoError(null);
    fetch(`${repoBase}/manifest.json`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`Manifest not found (${r.status})`);
        return r.json();
      })
      .then((data) => setRepoImages(Array.isArray(data?.images) ? data.images : []))
      .catch((err) => setRepoError(err.message))
      .finally(() => setRepoLoading(false));
  }, [open, repoBase]);

  const handleUpload = async () => {
    if (!file || !name) return;
    try {
      const publicUrl = await upload.mutateAsync({ file, name, altText: name, category: "general" });
      toast.success("Image uploaded and selected!");
      setFile(null);
      setName("");
      if (publicUrl) {
        onChange(publicUrl);
        setOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const selectImage = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        {value ? (
          <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border shrink-0">
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-16 w-16 rounded-lg border border-dashed border-border flex items-center justify-center shrink-0">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
            {value ? "Change" : "Select Image"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)} className="text-destructive">
              Remove
            </Button>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="library">
            <TabsList className="mb-4">
              <TabsTrigger value="library">Image Library</TabsTrigger>
              <TabsTrigger value="repo">Repo Images</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>

            <TabsContent value="library">
              {images.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No images in library. Upload one first.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => selectImage(img.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${
                        value === img.url ? "border-primary ring-2 ring-primary/30" : "border-border"
                      }`}
                    >
                      <img src={img.url} alt={img.alt_text || img.name} className="h-full w-full object-cover" />
                      {value === img.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <span className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur text-xs p-1 truncate">
                        {img.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="repo">
              <div className="mb-3 flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <FolderGit2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <div>
                  Add images to <code className="font-mono">public/uploads/</code> in your GitHub repo and list them in{" "}
                  <code className="font-mono">public/uploads/manifest.json</code>. They'll appear here automatically.
                </div>
              </div>
              {repoLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading repo images…</p>
              ) : repoError ? (
                <p className="text-center text-destructive py-8">{repoError}</p>
              ) : repoImages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No images in repo yet.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {repoImages.map((img) => {
                    const url = `${repoBase}/${img.file}`;
                    const fullUrl = `${window.location.origin}${url}`;
                    const isSelected = value === url || value === fullUrl;
                    return (
                      <button
                        key={img.file}
                        type="button"
                        onClick={() => selectImage(url)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${
                          isSelected ? "border-primary ring-2 ring-primary/30" : "border-border"
                        }`}
                      >
                        <img src={url} alt={img.alt || img.name} className="h-full w-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <span className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur text-xs p-1 truncate">
                          {img.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Image name" />
              </div>
              <div>
                <Label>File</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={handleUpload} disabled={upload.isPending || !file || !name}>
                {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Upload className="h-4 w-4 mr-1" />}
                Upload
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
