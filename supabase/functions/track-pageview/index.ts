import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function parseUserAgent(ua: string): { device_type: string; browser: string } {
  let device_type = "desktop";
  if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
    device_type = /iPad|Tablet/i.test(ua) ? "tablet" : "mobile";
  }

  let browser = "Unknown";
  if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua)) browser = "Safari";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";

  return { device_type, browser };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { page_path, referrer, session_id, blog_post_id } = await req.json();

    if (!page_path) {
      return new Response(JSON.stringify({ error: "page_path required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ua = req.headers.get("user-agent") || "";
    const { device_type, browser } = parseUserAgent(ua);

    // Try to get country from Cloudflare/Deno headers
    const country = req.headers.get("cf-ipcountry") ||
                    req.headers.get("x-vercel-ip-country") ||
                    req.headers.get("x-country") || "";
    const city = req.headers.get("x-vercel-ip-city") ||
                 req.headers.get("cf-ipcity") || "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { error } = await supabase.from("page_views").insert({
      page_path,
      referrer: referrer || "",
      session_id: session_id || "",
      blog_post_id: blog_post_id || null,
      device_type,
      browser,
      country,
      city,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("track-pageview error:", e);
    return new Response(JSON.stringify({ error: "Failed to track" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
