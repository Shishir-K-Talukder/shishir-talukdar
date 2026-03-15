import { BentoCard } from "@/components/BentoCard";
import { FlaskConical, GraduationCap, Bug, Microscope, Leaf, Heart } from "lucide-react";

const timeline = [
  { year: "2022 – Present", title: "Research Microbiologist", desc: "Leading independent research on antimicrobial resistance and microbial ecology." },
  { year: "2020 – 2022", title: "Graduate Research Assistant", desc: "Advanced studies in bacterial pathogenesis and molecular microbiology." },
  { year: "2016 – 2020", title: "BSc Microbiology", desc: "Comprehensive training in general and applied microbiology." },
];

export default function About() {
  return (
    <div className="container py-12 md:py-20">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Bio — spans 2 cols */}
        <BentoCard className="md:col-span-2 flex flex-col gap-6" delay={0}>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center border border-border">
              <FlaskConical className="h-9 w-9 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-heading">Shishir Kumar Talukder</h1>
              <p className="text-muted-foreground">Research Microbiologist</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            I'm a research microbiologist dedicated to understanding and harnessing the power of microorganisms. With over a decade of experience in antimicrobial resistance and bacterial pathogenesis, I combine cutting-edge techniques with innovative approaches to address global health challenges. My work bridges fundamental research with practical applications, aiming to develop solutions that improve human health and environmental sustainability.
          </p>
        </BentoCard>

        {/* Research philosophy */}
        <BentoCard delay={0.1}>
          <Heart className="h-6 w-6 text-primary mb-3" />
          <h2 className="text-lg font-bold font-heading mb-2">Research Philosophy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            I believe in open, collaborative science that transcends borders. By combining rigorous methodology with creative problem-solving, we can unlock the vast potential of microbial systems to benefit humanity.
          </p>
        </BentoCard>

        {/* Timeline — spans full width */}
        <BentoCard className="md:col-span-2 lg:col-span-3" delay={0.2}>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold font-heading">Education & Experience</h2>
          </div>
          <div className="space-y-6">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-6">
                  <span className="text-xs font-mono text-primary">{t.year}</span>
                  <h3 className="font-bold font-heading">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Expertise grid */}
        {[
          { icon: Bug, label: "Antimicrobial Resistance", desc: "Identifying and characterizing resistance mechanisms in clinical and environmental bacteria." },
          { icon: Microscope, label: "Bacterial Pathogenesis", desc: "Understanding virulence factors and host-pathogen interactions at the molecular level." },
          { icon: Leaf, label: "Microbial Ecology", desc: "Studying microbial community dynamics, biofilms, and interactions in diverse ecosystems." },
        ].map((e, i) => (
          <BentoCard key={e.label} delay={0.3 + i * 0.08}>
            <e.icon className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-bold font-heading mb-2">{e.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
          </BentoCard>
        ))}
      </div>
    </div>
  );
}
