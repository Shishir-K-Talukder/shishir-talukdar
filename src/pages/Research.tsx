import { BentoCard } from "@/components/BentoCard";
import { Badge } from "@/components/ui/badge";
import { Microscope, Leaf, FlaskConical, Bug, Dna, Droplets } from "lucide-react";

const projects = [
  {
    title: "Novel Antibiotic Resistance Mechanisms",
    description: "Investigating emerging patterns of antimicrobial resistance in clinical settings using advanced genomic approaches. This research focuses on identifying new resistance genes and understanding horizontal gene transfer mechanisms.",
    status: "Ongoing",
    tags: ["Genomics", "AMR", "Clinical"],
    icon: Bug,
  },
  {
    title: "Microbial Ecology Dynamics",
    description: "Exploring the complex interactions within microbial communities in extreme environments. Studying biofilm formation, quorum sensing, and metabolic cooperation in diverse ecological niches.",
    status: "Ongoing",
    tags: ["Ecology", "Biofilms", "Extremophiles"],
    icon: Leaf,
  },
  {
    title: "Pathogenesis of Multi-Drug Resistant Bacteria",
    description: "Characterizing virulence factors and pathogenic mechanisms of clinically relevant multi-drug resistant bacterial strains using molecular biology techniques.",
    status: "Completed",
    tags: ["MDR", "Virulence", "Molecular Biology"],
    icon: Microscope,
  },
  {
    title: "Environmental Microbiome Analysis",
    description: "Metagenomic analysis of soil and water microbiomes to understand microbial diversity and its impact on ecosystem health and nutrient cycling.",
    status: "Ongoing",
    tags: ["Metagenomics", "Environmental", "Bioinformatics"],
    icon: Droplets,
  },
  {
    title: "Phage Therapy Research",
    description: "Exploring bacteriophage-based therapeutic approaches as alternatives to traditional antibiotics for treating resistant bacterial infections.",
    status: "Planning",
    tags: ["Phage Therapy", "Therapeutics", "Innovation"],
    icon: Dna,
  },
  {
    title: "Microbial Biotechnology Applications",
    description: "Developing microbial-based solutions for bioremediation, bio-fertilizers, and sustainable agricultural practices.",
    status: "Completed",
    tags: ["Biotechnology", "Agriculture", "Sustainability"],
    icon: FlaskConical,
  },
];

const statusColor: Record<string, string> = {
  Ongoing: "bg-primary/20 text-primary border-primary/30",
  Completed: "bg-accent/20 text-accent border-accent/30",
  Planning: "bg-muted text-muted-foreground border-border",
};

export default function Research() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">Research Projects</h1>
        <p className="text-muted-foreground max-w-2xl">Exploring the frontiers of microbial science through innovative methodologies and interdisciplinary collaboration.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <BentoCard key={p.title} delay={i * 0.08} className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className={statusColor[p.status]}>{p.status}</Badge>
            </div>
            <div className="flex-1">
              <h3 className="font-bold font-heading mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="text-xs font-mono rounded-full border bg-secondary/50 px-3 py-1 text-muted-foreground">{t}</span>
              ))}
            </div>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}
