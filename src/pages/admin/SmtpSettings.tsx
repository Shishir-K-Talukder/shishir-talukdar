import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Mail, Server, Save, Loader2, Shield, Eye, EyeOff, Zap, Send, CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const PROVIDER_PRESETS = [
  { name: "Gmail", host: "smtp.gmail.com", port: 587, encryption: "tls", note: "Use App Password (not your regular password). Enable 2FA first → myaccount.google.com → Security → App Passwords.", icon: "📧" },
  { name: "Mailjet", host: "in-v3.mailjet.com", port: 587, encryption: "tls", note: "Use API Key as username and Secret Key as password. Find them at app.mailjet.com → API Keys.", icon: "✈️" },
  { name: "SendGrid", host: "smtp.sendgrid.net", port: 587, encryption: "tls", note: "Username is always 'apikey'. Password is your SendGrid API key.", icon: "📬" },
  { name: "Outlook / 365", host: "smtp.office365.com", port: 587, encryption: "tls", note: "Use your full email and password. May require admin approval for SMTP.", icon: "📨" },
  { name: "Yahoo Mail", host: "smtp.mail.yahoo.com", port: 465, encryption: "ssl", note: "Generate App Password under Account Security settings.", icon: "💜" },
  { name: "Zoho Mail", host: "smtp.zoho.com", port: 587, encryption: "tls", note: "Use your Zoho email/password. Enable 'Less secure apps' or use App Password.", icon: "🔵" },
  { name: "Amazon SES", host: "email-smtp.us-east-1.amazonaws.com", port: 587, encryption: "tls", note: "Use SMTP credentials from AWS SES console (not IAM). Region-specific host.", icon: "☁️" },
  { name: "Brevo (Sendinblue)", host: "smtp-relay.brevo.com", port: 587, encryption: "tls", note: "Use your login email as username and SMTP key (not password) from Settings → SMTP.", icon: "💚" },
];

export default function SmtpSettings() {
  const qc = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [form, setForm] = useState({
    host: "", port: 587, username: "", password: "",
    from_email: "", from_name: "", encryption_type: "tls", enabled: false,
  });

  const { data: smtp, isLoading } = useQuery({
    queryKey: ["smtp-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("smtp_settings").select("*").limit(1).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (smtp) {
      setForm({
        host: smtp.host, port: smtp.port, username: smtp.username, password: smtp.password,
        from_email: smtp.from_email, from_name: smtp.from_name,
        encryption_type: smtp.encryption_type, enabled: smtp.enabled,
      });
    }
  }, [smtp]);

  const save = useMutation({
    mutationFn: async () => {
      if (!smtp) return;
      const { error } = await supabase.from("smtp_settings").update(form).eq("id", smtp.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["smtp-settings"] }); toast.success("SMTP settings saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const sendTest = useMutation({
    mutationFn: async () => {
      if (!testEmail) throw new Error("Enter a test email address");
      const { data, error } = await supabase.functions.invoke("send-contact", {
        body: {
          name: "SMTP Test",
          email: testEmail,
          institution: "Test",
          subject: "SMTP Test Email",
          message: "This is a test email to verify your SMTP configuration is working correctly.",
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setTestResult({ ok: true, message: "Test email sent successfully! Check your inbox." });
    },
    onError: (e: Error) => {
      setTestResult({ ok: false, message: e.message || "Failed to send test email. Check your SMTP credentials." });
    },
  });

  const applyPreset = (preset: typeof PROVIDER_PRESETS[0]) => {
    setForm(p => ({
      ...p,
      host: preset.host,
      port: preset.port,
      encryption_type: preset.encryption,
    }));
    toast.info(`${preset.name} settings applied — fill in your credentials.`);
  };

  const activePreset = PROVIDER_PRESETS.find(p => p.host === form.host);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-heading font-bold">SMTP / Email Settings</h2>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4" /> Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={smtp?.enabled ? "default" : "secondary"} className="text-xs">
              {smtp?.enabled ? "✓ Active" : "○ Disabled"}
            </Badge>
            {smtp?.host ? (
              <>
                <span className="text-sm text-muted-foreground font-mono">
                  {smtp.host}:{smtp.port}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({smtp.encryption_type.toUpperCase()})
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Not configured</span>
            )}
            {smtp?.from_email && (
              <span className="text-sm text-muted-foreground">• From: {smtp.from_email}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Connect */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" /> Quick Connect — Providers
          </CardTitle>
          <CardDescription>
            Click a provider to auto-fill server settings, then enter your credentials below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROVIDER_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={cn(
                  "group relative rounded-xl border transition-all p-3 text-left",
                  activePreset?.host === preset.host
                    ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30"
                    : "border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{preset.icon}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {preset.name}
                  </span>
                </div>
                <span className="block text-[10px] text-muted-foreground font-mono truncate">
                  {preset.host}
                </span>
              </button>
            ))}
          </div>
          {activePreset && (
            <Alert className="mt-3">
              <Info className="h-4 w-4" />
              <AlertTitle className="text-sm">{activePreset.name} Setup</AlertTitle>
              <AlertDescription className="text-xs">
                {activePreset.note}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" /> Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
            <Switch checked={form.enabled} onCheckedChange={(v) => setForm(p => ({ ...p, enabled: v }))} />
            <div>
              <Label className="text-sm font-medium">Enable SMTP</Label>
              <p className="text-xs text-muted-foreground">When enabled, contact form emails will be sent via your SMTP server.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">SMTP Host</Label>
              <Input placeholder="smtp.gmail.com" value={form.host} onChange={e => setForm(p => ({ ...p, host: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Port</Label>
              <Input type="number" value={form.port} onChange={e => setForm(p => ({ ...p, port: parseInt(e.target.value) || 587 }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Username</Label>
              <Input placeholder="user@gmail.com" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Password / App Key</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="App password or API key"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">From Email</Label>
              <Input placeholder="noreply@domain.com" value={form.from_email} onChange={e => setForm(p => ({ ...p, from_email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">From Name</Label>
              <Input placeholder="Shishir K. Talukder" value={form.from_name} onChange={e => setForm(p => ({ ...p, from_name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Encryption</Label>
              <Select value={form.encryption_type} onValueChange={v => setForm(p => ({ ...p, encryption_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tls">TLS (Port 587)</SelectItem>
                  <SelectItem value="ssl">SSL (Port 465)</SelectItem>
                  <SelectItem value="none">None (Port 25)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={() => save.mutate()} disabled={save.isPending} className="w-full sm:w-auto">
            {save.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="h-4 w-4" /> Test Connection
          </CardTitle>
          <CardDescription>
            Send a test email to verify your SMTP configuration is working.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="test@example.com"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => { setTestResult(null); sendTest.mutate(); }}
              disabled={sendTest.isPending || !form.enabled}
            >
              {sendTest.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
              Send Test
            </Button>
          </div>
          {!form.enabled && (
            <p className="text-xs text-muted-foreground">Enable SMTP above and save before testing.</p>
          )}
          {testResult && (
            <Alert variant={testResult.ok ? "default" : "destructive"}>
              {testResult.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertDescription className="text-sm">{testResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
