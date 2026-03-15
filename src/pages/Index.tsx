import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, FlaskConical, Microscope, Bug, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BentoCard } from "@/components/BentoCard";

const stats = [
  { value: "09+", label: "Research Projects" },
  { value: "94.8%", label: "Success Rate" },
  { value: "03+", label: "Global Partners" },
  { value: "2+", label: "Years Research" },
];

export default function Index() {
  return (
    <div className="container py-12 md:py-20">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Hero — spans 2 cols */}
        <BentoCard className="md:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col justify-between gap-6" delay={0}>
          <div>
            <p className="text-sm font-mono font-medium text-primary mb-3">Shishir Kumar Talukder</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight mb-4">
              Advancing the Future of{" "}
              <span className="text-gradient">Microbial Science</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-lg">
              Pioneering research and innovative solutions in microbial science for a healthier tomorrow.
            </p>
          </div>

          {/* Profile placeholder */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center border border-border">
              <FlaskConical className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Research Microbiologist</p>
              <p className="text-sm text-muted-foreground">Antimicrobial Resistance Specialist</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/contact">Request Collaboration</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/research">View Research <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </BentoCard>

        {/* Stats */}
        {stats.map((s, i) => (
          <BentoCard key={s.label} className="text-center flex flex-col items-center justify-center gap-1" delay={0.1 + i * 0.05}>
            <span className="text-3xl md:text-4xl font-bold font-mono text-primary">{s.value}</span>
            <span className="text-sm text-muted-foreground">{s.label}</span>
          </BentoCard>
        ))}

        {/* About */}
        <BentoCard className="md:col-span-2" delay={0.3}>
          <h2 className="text-xl font-bold font-heading mb-3">Welcome to My Lab</h2>
          <p className="text-muted-foreground leading-relaxed text-sm mb-4">
            I'm Shishir Kumar Talukder, a research microbiologist dedicated to understanding and harnessing the power of microorganisms. With experience in antimicrobial resistance and bacterial pathogenesis, I combine cutting-edge techniques with innovative approaches to address global health challenges.
          </p>
          <Link to="/about" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            Read more <ArrowRight className="h-3 w-3" />
          </Link>
        </BentoCard>

        {/* Featured Research 1 */}
        <BentoCard delay={0.35}>
          <div className="flex items-center gap-2 mb-3">
            <Microscope className="h-5 w-5 text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Featured</span>
          </div>
          <h3 className="font-bold font-heading mb-2">Novel Antibiotic Resistance Mechanisms</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Investigating emerging patterns of antimicrobial resistance in clinical settings using advanced genomic approaches.
          </p>
          <Link to="/research" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            Learn More <ArrowRight className="h-3 w-3" />
          </Link>
        </BentoCard>

        {/* Featured Research 2 */}
        <BentoCard delay={0.4}>
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="h-5 w-5 text-accent" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Featured</span>
          </div>
          <h3 className="font-bold font-heading mb-2">Microbial Ecology Dynamics</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Exploring the complex interactions within microbial communities in extreme environments.
          </p>
          <Link to="/research" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            Learn More <ArrowRight className="h-3 w-3" />
          </Link>
        </BentoCard>

        {/* Expertise */}
        <BentoCard className="md:col-span-2" delay={0.45}>
          <h2 className="text-xl font-bold font-heading mb-4">Core Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Bug, label: "Antimicrobial Resistance" },
              { icon: Microscope, label: "Bacterial Pathogenesis" },
              { icon: Leaf, label: "Microbial Ecology" },
            ].map((e) => (
              <div key={e.label} className="flex items-center gap-2 rounded-full border bg-secondary/50 px-4 py-2 text-sm">
                <e.icon className="h-4 w-4 text-primary" />
                <span>{e.label}</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Quick Links */}
        <BentoCard className="md:col-span-2 flex gap-4" delay={0.5}>
          <Link to="/publications" className="flex-1 flex flex-col items-center justify-center gap-2 rounded-2xl border bg-secondary/30 p-5 hover:border-primary/30 transition-colors">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold font-mono">1+</span>
            <span className="text-sm text-muted-foreground">Publications</span>
          </Link>
          <Link to="/collaborations" className="flex-1 flex flex-col items-center justify-center gap-2 rounded-2xl border bg-secondary/30 p-5 hover:border-primary/30 transition-colors">
            <Users className="h-6 w-6 text-accent" />
            <span className="text-2xl font-bold font-mono">8+</span>
            <span className="text-sm text-muted-foreground">Collaborations</span>
          </Link>
        </BentoCard>
      </div>
    </div>
  );
}
