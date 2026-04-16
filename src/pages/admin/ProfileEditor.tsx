import { useState, useEffect } from "react";
import { useContentValue, useUpsertContent } from "@/hooks/useSiteContent";
import { useUploadImage } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BentoCard } from "@/components/BentoCard";
import { toast } from "sonner";
import { Loader2, Upload, User, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileEditor() {
  const { value: name } = useContentValue("profile", "name", "Shishir Kumar Talukder");
  const { value: title } = useContentValue("profile", "title", "Research Microbiologist");
  const { value: subtitle } = useContentValue("profile", "subtitle", "Antimicrobial Resistance Specialist");
  const { value: bio } = useContentValue("profile", "bio", "");
  const { value: profileImage } = useContentValue("profile", "profile_image", "");

  const upsert = useUpsertContent();

  const [form, setForm] = useState({ name: "", title: "", subtitle: "", bio: "" });
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ name, title, subtitle, bio });
    setImgUrl(profileImage);
  }, [name, title, subtitle, bio, profileImage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `profile/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("site-images").upload(path, file);
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from("site-images").getPublicUrl(path);
      setImgUrl(publicUrl);
      await upsert.mutateAsync({ section: "profile", key: "profile_image", value: publicUrl });
      toast.success("Profile picture updated!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        upsert.mutateAsync({ section: "profile", key: "name", value: form.name }),
        upsert.mutateAsync({ section: "profile", key: "title", value: form.title }),
        upsert.mutateAsync({ section: "profile", key: "subtitle", value: form.subtitle }),
        upsert.mutateAsync({ section: "profile", key: "bio", value: form.bio }),
      ]);
      toast.success("Profile saved!");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-heading font-bold mb-1">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your profile picture and info. Changes sync to Home, About, and Blog pages.</p>
      </div>

      {/* Profile Picture */}
      <BentoCard className="p-6">
        <Label className="text-sm font-medium mb-3 block">Profile Picture</Label>
        <div className="flex items-center gap-5">
          <div className="relative group">
            {imgUrl ? (
              <img src={imgUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-primary/40" />
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <label className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Click to upload a new profile picture</p>
            <p className="text-xs">JPG, PNG, WebP · Max 5MB</p>
          </div>
        </div>
      </BentoCard>

      {/* Profile Info */}
      <BentoCard className="p-6 space-y-4">
        <div>
          <Label htmlFor="prof-name">Full Name</Label>
          <Input id="prof-name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="prof-title">Title / Role</Label>
          <Input id="prof-title" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Research Microbiologist" />
        </div>
        <div>
          <Label htmlFor="prof-subtitle">Subtitle / Specialization</Label>
          <Input id="prof-subtitle" value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. Antimicrobial Resistance Specialist" />
        </div>
        <div>
          <Label htmlFor="prof-bio">Bio</Label>
          <Textarea id="prof-bio" value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={5} placeholder="Write a brief bio..." />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
          Save Profile
        </Button>
      </BentoCard>
    </div>
  );
}
