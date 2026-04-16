
-- Add 'editor' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';

-- Create SMTP settings table
CREATE TABLE public.smtp_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host text NOT NULL DEFAULT '',
  port integer NOT NULL DEFAULT 587,
  username text NOT NULL DEFAULT '',
  password text NOT NULL DEFAULT '',
  from_email text NOT NULL DEFAULT '',
  from_name text NOT NULL DEFAULT '',
  encryption_type text NOT NULL DEFAULT 'tls',
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read smtp_settings"
  ON public.smtp_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update smtp_settings"
  ON public.smtp_settings FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert smtp_settings"
  ON public.smtp_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete smtp_settings"
  ON public.smtp_settings FOR DELETE TO authenticated USING (true);

-- Insert default row
INSERT INTO public.smtp_settings (host, port, from_email, from_name)
VALUES ('smtp.gmail.com', 587, 'noreply@example.com', 'Shishir K. Talukder');

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  institution text NOT NULL DEFAULT '',
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated users can read submissions"
  ON public.contact_submissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON public.contact_submissions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete submissions"
  ON public.contact_submissions FOR DELETE TO authenticated USING (true);
