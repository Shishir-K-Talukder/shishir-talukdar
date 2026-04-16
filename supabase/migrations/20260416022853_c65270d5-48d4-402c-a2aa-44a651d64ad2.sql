
-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon_name TEXT NOT NULL DEFAULT 'Tag',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert blog categories" ON public.blog_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update blog categories" ON public.blog_categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete blog categories" ON public.blog_categories FOR DELETE TO authenticated USING (true);

-- Add category_id to blog_posts
ALTER TABLE public.blog_posts ADD COLUMN category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL;
