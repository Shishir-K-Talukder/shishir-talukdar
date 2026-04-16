CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  referrer TEXT DEFAULT '',
  country TEXT DEFAULT '',
  city TEXT DEFAULT '',
  device_type TEXT DEFAULT 'desktop',
  browser TEXT DEFAULT '',
  session_id TEXT DEFAULT '',
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for common queries
CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_page_path ON public.page_views (page_path);
CREATE INDEX idx_page_views_blog_post ON public.page_views (blog_post_id) WHERE blog_post_id IS NOT NULL;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (tracking)
CREATE POLICY "Anyone can log page views"
ON public.page_views
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "Authenticated users can read page views"
ON public.page_views
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can delete (cleanup)
CREATE POLICY "Authenticated users can delete page views"
ON public.page_views
FOR DELETE
TO authenticated
USING (true);