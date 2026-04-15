import { useState } from "react";
import { z } from "zod";
import { BentoCard } from "@/components/BentoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Building2, Send, MapPin, Clock } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  institution: z.string().min(2, "Institution is required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>({ name: "", email: "", institution: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof FormData] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast({ title: "Message sent!", description: "Thank you for reaching out. I'll get back to you soon." });
    setForm({ name: "", email: "", institution: "", subject: "", message: "" });
  };

  const update = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">Request Collaboration</h1>
        <p className="text-muted-foreground max-w-xl">Interested in collaborating on microbial research? Let's connect and explore possibilities together.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Form — spans 2 cols */}
        <BentoCard className="md:col-span-2" delay={0}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Dr. Jane Doe" value={form.name} onChange={(e) => update("name", e.target.value)} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jane@university.edu" value={form.email} onChange={(e) => update("email", e.target.value)} />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution / Organization</Label>
                <Input id="institution" placeholder="University of Science" value={form.institution} onChange={(e) => update("institution", e.target.value)} />
                {errors.institution && <p className="text-xs text-destructive">{errors.institution}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Research collaboration on AMR" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Describe your research interests and how you'd like to collaborate..." rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </form>
        </BentoCard>

        {/* Contact info */}
        <div className="flex flex-col gap-4">
          <BentoCard delay={0.1}>
            <Mail className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-bold font-heading mb-1">Email</h3>
            <a href="mailto:shishir.talukder@research.org" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              shishir.talukder@research.org
            </a>
          </BentoCard>
          <BentoCard delay={0.15}>
            <Building2 className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-bold font-heading mb-1">Affiliation</h3>
            <p className="text-sm text-muted-foreground">Department of Microbiology</p>
            <p className="text-sm text-muted-foreground">Advanced Research Laboratory</p>
          </BentoCard>
          <BentoCard delay={0.2}>
            <MapPin className="h-6 w-6 text-accent mb-3" />
            <h3 className="font-bold font-heading mb-1">Location</h3>
            <p className="text-sm text-muted-foreground">Dhaka, Bangladesh</p>
          </BentoCard>
          <BentoCard delay={0.25}>
            <Clock className="h-6 w-6 text-muted-foreground mb-3" />
            <h3 className="font-bold font-heading mb-1">Response Time</h3>
            <p className="text-sm text-muted-foreground">Typically within 48 hours</p>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
