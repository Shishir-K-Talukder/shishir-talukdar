import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeoData {
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  excerpt: string;
  coverImageUrl: string | null;
}

interface Check {
  label: string;
  passed: boolean;
  warning?: boolean;
  tip: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function analyzeReadability(text: string) {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const avgLen = sentences.length ? text.split(/\s+/).length / sentences.length : 0;
  const longSentences = sentences.filter(s => s.split(/\s+/).length > 25).length;
  return { avgSentenceLen: Math.round(avgLen), longSentences };
}

export function BlogSeoAnalyzer({ data }: { data: SeoData }) {
  const plainContent = useMemo(() => stripHtml(data.content), [data.content]);
  const wordCount = useMemo(() => plainContent.split(/\s+/).filter(Boolean).length, [plainContent]);
  const readability = useMemo(() => analyzeReadability(plainContent), [plainContent]);

  const kw = data.focusKeyword.toLowerCase().trim();
  const kwCount = kw ? (plainContent.toLowerCase().match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length : 0;
  const kwDensity = wordCount > 0 && kw ? ((kwCount / wordCount) * 100).toFixed(1) : "0";

  const checks: Check[] = useMemo(() => {
    const c: Check[] = [];
    // Title
    const st = data.seoTitle || data.title;
    c.push({ label: "SEO Title length", passed: st.length >= 30 && st.length <= 60, warning: st.length > 0 && (st.length < 30 || st.length > 60), tip: `${st.length}/60 chars. Ideal: 50–60.` });
    // Meta desc
    c.push({ label: "Meta description", passed: data.metaDescription.length >= 120 && data.metaDescription.length <= 160, warning: data.metaDescription.length > 0 && (data.metaDescription.length < 120 || data.metaDescription.length > 160), tip: `${data.metaDescription.length}/160 chars. Ideal: 120–150.` });
    // Focus keyword
    c.push({ label: "Focus keyword set", passed: kw.length > 0, tip: kw ? `"${kw}"` : "Set a focus keyword for analysis." });
    // KW in title
    if (kw) c.push({ label: "Keyword in title", passed: data.title.toLowerCase().includes(kw), tip: "Include focus keyword in blog title." });
    // KW in slug
    if (kw) c.push({ label: "Keyword in URL slug", passed: data.slug.toLowerCase().includes(kw.replace(/\s+/g, "-")), tip: "Include keyword in URL slug." });
    // KW in meta desc
    if (kw) c.push({ label: "Keyword in meta description", passed: data.metaDescription.toLowerCase().includes(kw), tip: "Use focus keyword in meta description." });
    // KW in H1 (title acts as H1)
    if (kw) c.push({ label: "Keyword in H1", passed: data.title.toLowerCase().includes(kw), tip: "Title serves as H1 — include keyword." });
    // KW density
    if (kw) c.push({ label: "Keyword density (1-3%)", passed: parseFloat(kwDensity) >= 1 && parseFloat(kwDensity) <= 3, warning: parseFloat(kwDensity) > 3, tip: `${kwDensity}% (${kwCount} occurrences in ${wordCount} words).` });
    // Content length
    c.push({ label: "Content length ≥ 300 words", passed: wordCount >= 300, tip: `${wordCount} words. Aim for 300+ for SEO.` });
    // Excerpt
    c.push({ label: "Excerpt/summary set", passed: data.excerpt.length > 20, tip: data.excerpt ? `${data.excerpt.length} chars` : "Add a compelling excerpt." });
    // Cover image
    c.push({ label: "Cover image set", passed: !!data.coverImageUrl, tip: "Posts with images perform better." });
    // Readability
    c.push({ label: "Readability (avg < 20 words/sentence)", passed: readability.avgSentenceLen <= 20, warning: readability.avgSentenceLen > 25, tip: `Avg ${readability.avgSentenceLen} words/sentence. ${readability.longSentences} long sentences.` });
    // Has H2/H3
    c.push({ label: "Uses subheadings (H2/H3)", passed: /<h[23]/i.test(data.content), tip: "Use H2/H3 for content structure." });

    return c;
  }, [data, kw, kwDensity, kwCount, wordCount, readability]);

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  const scoreColor = score >= 80 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
  const progressColor = score >= 80 ? "bg-green-400" : score >= 50 ? "bg-yellow-400" : "bg-red-400";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-heading font-bold">SEO Score</h3>
        <span className={cn("text-2xl font-bold font-mono", scoreColor)}>{score}%</span>
      </div>
      <Progress value={score} className="h-2" indicatorClassName={progressColor} />

      <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
        {checks.map((c, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            {c.passed ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0 mt-0.5" />
            ) : c.warning ? (
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-medium">{c.label}</span>
              <span className="text-muted-foreground ml-1.5">— {c.tip}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
        <div className="text-center">
          <div className="text-lg font-mono font-bold">{wordCount}</div>
          <div className="text-[10px] text-muted-foreground">Words</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-mono font-bold">{kwDensity}%</div>
          <div className="text-[10px] text-muted-foreground">KW Density</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-mono font-bold">{readability.avgSentenceLen}</div>
          <div className="text-[10px] text-muted-foreground">Avg Sent Len</div>
        </div>
      </div>
    </div>
  );
}
