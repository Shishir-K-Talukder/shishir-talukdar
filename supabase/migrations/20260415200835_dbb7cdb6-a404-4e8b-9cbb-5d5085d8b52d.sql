
-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Authenticated users can read all blog posts" ON public.blog_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update blog posts" ON public.blog_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete blog posts" ON public.blog_posts FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Ad placements table
CREATE TABLE public.ad_placements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  ad_client TEXT NOT NULL DEFAULT '',
  ad_slot TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT false,
  position TEXT NOT NULL DEFAULT 'sidebar',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ad placements" ON public.ad_placements FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert ad placements" ON public.ad_placements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update ad placements" ON public.ad_placements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete ad placements" ON public.ad_placements FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_ad_placements_updated_at BEFORE UPDATE ON public.ad_placements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default ad placement positions
INSERT INTO public.ad_placements (name, position) VALUES
  ('Blog Sidebar Top', 'sidebar'),
  ('Blog Inline After Intro', 'inline'),
  ('Blog Bottom', 'bottom');
