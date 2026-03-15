import { useState } from "react";
import { BentoCard } from "@/components/BentoCard";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, ExternalLink } from "lucide-react";

const publications = [
  {
    title: "Emerging Patterns of Antimicrobial Resistance in Clinical Isolates: A Genomic Perspective",
    journal: "Journal of Antimicrobial Chemotherapy",
    year: 2024,
    doi: "10.1093/jac/example001",
    abstract: "This study investigates the genomic basis of antimicrobial resistance in clinical bacterial isolates, revealing novel resistance mechanisms and horizontal gene transfer patterns across diverse bacterial species.",
    topics: ["AMR", "Genomics"],
  },
  {
    title: "Biofilm Formation Dynamics in Extreme Environments: Insights from Metagenomic Analysis",
    journal: "Environmental Microbiology Reports",
    year: 2023,
    doi: "10.1111/example002",
    abstract: "We present comprehensive metagenomic data on biofilm-forming microbial communities in extreme environments, highlighting the role of quorum sensing and metabolic cooperation.",
    topics: ["Ecology", "Metagenomics"],
  },
  {
    title: "Characterization of Virulence Factors in Multi-Drug Resistant Bacterial Strains",
    journal: "Microbial Pathogenesis",
    year: 2023,
    doi: "10.1016/example003",
    abstract: "A comprehensive molecular characterization of virulence determinants in clinically significant multi-drug resistant bacteria, with implications for therapeutic intervention strategies.",
    topics: ["MDR", "Pathogenesis"],
  },
];

export default function Publications() {
  const [search, setSearch] = useState("");
  const filtered = publications.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.journal.toLowerCase().includes(search.toLowerCase()) ||
      p.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">Publications</h1>
          <p className="text-muted-foreground max-w-xl">Contributing to the global body of scientific knowledge through peer-reviewed research.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search publications..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((p, i) => (
          <BentoCard key={p.doi} delay={i * 0.08} className="flex flex-col gap-3 md:flex-row md:gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold font-heading mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{p.abstract}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{p.journal}</span>
                <span className="font-mono">{p.year}</span>
                <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="font-mono text-primary hover:underline inline-flex items-center gap-1">
                  DOI <ExternalLink className="h-3 w-3" />
                </a>
                {p.topics.map((t) => (
                  <span key={t} className="rounded-full border bg-secondary/50 px-2 py-0.5">{t}</span>
                ))}
              </div>
            </div>
          </BentoCard>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No publications found matching your search.</p>
        )}
      </div>
    </div>
  );
}
