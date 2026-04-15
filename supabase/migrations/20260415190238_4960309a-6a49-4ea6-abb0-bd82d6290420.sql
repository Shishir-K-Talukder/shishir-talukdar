
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'html', 'number', 'json')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section, key)
);

CREATE TABLE public.site_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  og_title TEXT DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  keywords TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.site_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read site_metadata" ON public.site_metadata FOR SELECT USING (true);
CREATE POLICY "Anyone can read site_images" ON public.site_images FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert site_content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site_content" ON public.site_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete site_content" ON public.site_content FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert site_metadata" ON public.site_metadata FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site_metadata" ON public.site_metadata FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete site_metadata" ON public.site_metadata FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert site_images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site_images" ON public.site_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete site_images" ON public.site_images FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_metadata_updated_at BEFORE UPDATE ON public.site_metadata FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

CREATE POLICY "Anyone can view site images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Authenticated users can upload site images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images');
CREATE POLICY "Authenticated users can update site images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-images');
CREATE POLICY "Authenticated users can delete site images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images');

INSERT INTO public.site_metadata (page, title, description, og_title, og_description) VALUES
  ('home', 'Shishir Kumar Talukder | Advanced Microbiology Research', 'Pioneering research and innovative solutions in microbial science for a healthier tomorrow.', 'Shishir Kumar Talukder | Microbiology Research', 'Advancing the future of microbial science through innovative research.'),
  ('research', 'Research | Shishir Kumar Talukder', 'Exploring antimicrobial resistance, bacterial pathogenesis, and microbial ecology.', '', ''),
  ('publications', 'Publications | Shishir Kumar Talukder', 'Academic publications and research papers in microbiology.', '', ''),
  ('collaborations', 'Collaborations | Shishir Kumar Talukder', 'Research collaborations and institutional partnerships.', '', ''),
  ('about', 'About | Shishir Kumar Talukder', 'Research microbiologist dedicated to understanding microorganisms.', '', ''),
  ('contact', 'Contact | Shishir Kumar Talukder', 'Get in touch for research collaborations.', '', '');
