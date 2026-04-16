import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, institution, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Save submission
    await supabase.from("contact_submissions").insert({ name, email, institution, subject, message });

    // Get SMTP settings
    const { data: smtp } = await supabase.from("smtp_settings").select("*").limit(1).single();

    if (smtp?.enabled && smtp.host && smtp.username && smtp.password) {
      // Send via SMTP using Deno's smtp client
      const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
      
      const client = new SMTPClient({
        connection: {
          hostname: smtp.host,
          port: smtp.port,
          tls: smtp.encryption_type === "ssl",
          auth: { username: smtp.username, password: smtp.password },
        },
      });

      await client.send({
        from: `${smtp.from_name} <${smtp.from_email}>`,
        to: smtp.from_email,
        subject: `[Contact] ${subject} - from ${name}`,
        content: `Name: ${name}\nEmail: ${email}\nInstitution: ${institution}\nSubject: ${subject}\n\nMessage:\n${message}`,
      });

      await client.close();
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
