import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, title, content, focusKeyword, excerpt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "suggest-title":
        systemPrompt = "You are an SEO blog expert. Suggest 5 compelling, SEO-optimized blog title alternatives. Return a JSON array of strings.";
        userPrompt = `Current title: "${title}"\nFocus keyword: "${focusKeyword || 'none'}"\nContent excerpt: "${(content || "").slice(0, 500)}"`;
        break;
      case "suggest-meta":
        systemPrompt = "You are an SEO expert. Generate 3 meta descriptions (120-150 chars each) for the blog post. Return a JSON array of strings.";
        userPrompt = `Title: "${title}"\nFocus keyword: "${focusKeyword || 'none'}"\nExcerpt: "${excerpt || (content || "").slice(0, 300)}"`;
        break;
      case "suggest-headings":
        systemPrompt = "You are a blog content strategist. Suggest 5 H2 subheadings that would improve the blog post structure and SEO. Return a JSON array of strings.";
        userPrompt = `Title: "${title}"\nFocus keyword: "${focusKeyword || 'none'}"\nCurrent content: "${(content || "").slice(0, 1000)}"`;
        break;
      case "improve-content":
        systemPrompt = "You are a professional blog editor. Analyze the content and provide 3-5 specific, actionable improvement suggestions for readability, SEO, and engagement. Return a JSON array of strings.";
        userPrompt = `Title: "${title}"\nFocus keyword: "${focusKeyword || 'none'}"\nContent: "${(content || "").slice(0, 2000)}"`;
        break;
      case "generate-excerpt":
        systemPrompt = "You are a blog copywriter. Write a compelling excerpt/summary (2-3 sentences, under 200 chars) for the blog post. Return just the text, no JSON.";
        userPrompt = `Title: "${title}"\nContent: "${(content || "").slice(0, 1000)}"`;
        break;
      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Try to parse as JSON array
    let result: any = text;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) result = JSON.parse(jsonMatch[0]);
    } catch {
      // Keep as text
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("blog-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
