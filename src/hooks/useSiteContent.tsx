import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent(section?: string) {
  return useQuery({
    queryKey: ["site-content", section],
    queryFn: async () => {
      let query = supabase.from("site_content").select("*");
      if (section) query = query.eq("section", section);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useContentValue(section: string, key: string, fallback: string = "") {
  const { data, isLoading } = useSiteContent(section);
  const item = data?.find((d) => d.key === key);
  return { value: item?.value ?? fallback, isLoading };
}

export function useUpsertContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ section, key, value, type = "text" }: { section: string; key: string; value: string; type?: string }) => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ section, key, value, type }, { onConflict: "section,key" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-content"] }),
  });
}

export function useSiteMetadata(page?: string) {
  return useQuery({
    queryKey: ["site-metadata", page],
    queryFn: async () => {
      let query = supabase.from("site_metadata").select("*");
      if (page) query = query.eq("page", page).single();
      const { data, error } = await query;
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateMetadata() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { page: string; title: string; description: string; og_title?: string; og_description?: string; og_image?: string; keywords?: string }) => {
      const { error } = await supabase
        .from("site_metadata")
        .upsert(row, { onConflict: "page" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-metadata"] }),
  });
}

export function useSiteImages(category?: string) {
  return useQuery({
    queryKey: ["site-images", category],
    queryFn: async () => {
      let query = supabase.from("site_images").select("*").order("created_at", { ascending: false });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, name, altText, category }: { file: File; name: string; altText: string; category: string }) => {
      const ext = file.name.split(".").pop();
      const path = `${category}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("site-images").upload(path, file);
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from("site-images").getPublicUrl(path);
      const { error: dbErr } = await supabase.from("site_images").insert({ name, url: publicUrl, alt_text: altText, category });
      if (dbErr) throw dbErr;
      return publicUrl;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-images"] }),
  });
}

export function useDeleteImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) => {
      // Extract path from URL
      const match = url.match(/site-images\/(.+)$/);
      if (match) {
        await supabase.storage.from("site-images").remove([match[1]]);
      }
      const { error } = await supabase.from("site_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-images"] }),
  });
}
