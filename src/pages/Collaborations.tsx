import { BentoCard } from "@/components/BentoCard";
import { Building2, ExternalLink } from "lucide-react";

const collaborations = [
  {
    institution: "National Institute of Health",
    country: "Bangladesh",
    description: "Joint research on antimicrobial resistance surveillance and epidemiological studies across clinical settings.",
    focus: "AMR Surveillance",
  },
  {
    institution: "WHO Regional Laboratory Network",
    country: "Global",
    description: "Collaboration on global antimicrobial resistance monitoring and data sharing for policy development.",
    focus: "Global Health Policy",
  },
  {
    institution: "University of Dhaka — Microbiology Dept.",
    country: "Bangladesh",
    description: "Academic partnership for graduate research supervision and joint publication efforts in microbial ecology.",
    focus: "Academic Research",
  },
  {
    institution: "Southeast Asian Biofilm Consortium",
    country: "Regional",
    description: "Multi-institutional study of biofilm formation in tropical aquatic environments and its implications for water quality.",
    focus: "Environmental Studies",
  },
  {
    institution: "International Centre for Diarrhoeal Disease Research",
    country: "Bangladesh",
    description: "Collaborative investigation of enteric pathogen resistance patterns and novel therapeutic approaches.",
    focus: "Enteric Pathogens",
  },
  {
    institution: "Global Phage Therapy Initiative",
    country: "International",
    description: "Exploring bacteriophage-based treatments as alternatives to conventional antibiotics in clinical trials.",
    focus: "Phage Therapy",
  },
  {
    institution: "Agricultural Microbiology Research Centre",
    country: "Bangladesh",
    description: "Developing microbial solutions for sustainable agriculture including bio-fertilizers and biopesticides.",
    focus: "Agricultural Biotech",
  },
  {
    institution: "European Antibiotic Resistance Network",
    country: "Europe",
    description: "Data sharing and collaborative genomic studies to track the spread of resistance genes across continents.",
    focus: "Genomic Epidemiology",
  },
];

export default function Collaborations() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">Collaborations</h1>
        <p className="text-muted-foreground max-w-2xl">Working with global institutions to advance microbial science and address public health challenges.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collaborations.map((c, i) => (
          <BentoCard key={c.institution} delay={i * 0.06} className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-secondary border border-border flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">{c.country}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold font-heading mb-1">{c.institution}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono rounded-full border bg-secondary/50 px-3 py-1 text-primary">{c.focus}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}
