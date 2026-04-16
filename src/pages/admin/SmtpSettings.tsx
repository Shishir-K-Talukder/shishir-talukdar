import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Mail, Server, Save, Loader2, Shield, Eye, EyeOff } from "lucide-react";

export default function SmtpSettings() {
  const qc = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
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

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-heading font-bold">SMTP / Email Settings</h2>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4" /> Current SMTP Server
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant={smtp?.enabled ? "default" : "secondary"}>
              {smtp?.enabled ? "Active" : "Disabled"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {smtp?.host ? `${smtp.host}:${smtp.port}` : "Not configured"}
            </span>
            {smtp?.from_email && (
              <span className="text-sm text-muted-foreground">• From: {smtp.from_email}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" /> SMTP Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={form.enabled} onCheckedChange={(v) => setForm(p => ({ ...p, enabled: v }))} />
            <Label>Enable SMTP sending</Label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>SMTP Host</Label>
              <Input placeholder="smtp.gmail.com" value={form.host} onChange={e => setForm(p => ({ ...p, host: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Port</Label>
              <Input type="number" value={form.port} onChange={e => setForm(p => ({ ...p, port: parseInt(e.target.value) || 587 }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Username</Label>
              <Input placeholder="user@gmail.com" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="App password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>From Email</Label>
              <Input placeholder="noreply@domain.com" value={form.from_email} onChange={e => setForm(p => ({ ...p, from_email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>From Name</Label>
              <Input placeholder="Shishir K. Talukder" value={form.from_name} onChange={e => setForm(p => ({ ...p, from_name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Encryption</Label>
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
    </div>
  );
}
