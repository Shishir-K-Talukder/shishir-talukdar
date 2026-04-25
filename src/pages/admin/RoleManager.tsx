import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Shield, UserPlus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function RoleManager() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const normalizedEmail = useMemo(() => newEmail.trim().toLowerCase(), [newEmail]);
  const fallbackSql = `-- External database fix for admin creation\n-- Run this in your external database SQL editor\n\ncreate extension if not exists pgcrypto;\n\ndo $$\nbegin\n  if not exists (select 1 from pg_type where typname = 'app_role') then\n    create type public.app_role as enum ('admin', 'moderator', 'user', 'editor');\n  end if;\nend$$;\n\ncreate table if not exists public.user_roles (\n  id uuid primary key default gen_random_uuid(),\n  user_id uuid not null,\n  role public.app_role not null,\n  created_at timestamptz not null default now(),\n  unique (user_id, role)\n);\n\nalter table public.user_roles enable row level security;\n\ncreate or replace function public.has_role(_user_id uuid, _role public.app_role)\nreturns boolean\nlanguage sql\nstable\nsecurity definer\nset search_path = public\nas $$\n  select exists (\n    select 1 from public.user_roles\n    where user_id = _user_id and role = _role\n  )\n$$;\n\ndrop policy if exists \"Authenticated users can read roles\" on public.user_roles;\ndrop policy if exists \"Admins can insert roles\" on public.user_roles;\ndrop policy if exists \"Admins can delete roles\" on public.user_roles;\n\ncreate policy \"Authenticated users can read roles\"\non public.user_roles\nfor select\nto authenticated\nusing (true);\n\ncreate policy \"Admins can insert roles\"\non public.user_roles\nfor insert\nto authenticated\nwith check (public.has_role(auth.uid(), 'admin'::public.app_role));\n\ncreate policy \"Admins can delete roles\"\non public.user_roles\nfor delete\nto authenticated\nusing (public.has_role(auth.uid(), 'admin'::public.app_role));`;

  const validateInput = () => {
    if (!normalizedEmail || !newPassword) throw new Error("Email and password are required.");
    if (newPassword.length < 8) throw new Error("Password must be at least 8 characters.");
  };

  const createUserWithClientFallback = async () => {
    const isolatedClient = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    const { data, error } = await isolatedClient.auth.signUp({
      email: normalizedEmail,
      password: newPassword,
    });

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        throw new Error("User already exists in external auth. Run the external_admin_fix.sql file to grant or reset admin access.");
      }
      throw new Error(error.message);
    }

    const createdUserId = data.user?.id;
    if (!createdUserId) {
      throw new Error("User account was created but no user id was returned.");
    }

    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: createdUserId,
      role: newRole as "admin" | "moderator" | "editor" | "user",
    });

    if (roleError) {
      throw new Error(roleError.message);
    }
  };

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const createAdmin = useMutation({
    mutationFn: async () => {
      validateInput();

      const res = await supabase.functions.invoke("create-admin", {
        body: { email: normalizedEmail, password: newPassword, role: newRole },
      });

      if (!res.error && !res.data?.error) return;

      const errorMessage = `${res.error?.message ?? ""} ${res.data?.error ?? ""}`.toLowerCase();
      const shouldUseClientFallback = [
        "edge function",
        "failed to fetch",
        "failed to send",
        "not found",
        "404",
        "functionshttperror",
        "unable to reach",
      ].some((term) => errorMessage.includes(term));

      if (shouldUseClientFallback) {
        await createUserWithClientFallback();
        return;
      }

      throw new Error(res.data?.error || res.error?.message || "Unable to create user");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success("User created successfully");
      setNewEmail("");
      setNewPassword("");
    },
    onError: (e: Error) => {
      const message = e.message.toLowerCase();
      if (message.includes("row-level security") || message.includes("permission") || message.includes("user_roles") || message.includes("external_admin_fix.sql") || message.includes("already exists in external auth")) {
        navigator.clipboard?.writeText(fallbackSql).catch(() => undefined);
        toast.error("External DB needs role SQL. The fix SQL has been copied to your clipboard.");
        return;
      }
      toast.error(e.message);
    },
  });

  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-roles"] });
      toast.success("Role removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const roleColor = (role: string) => {
    switch (role) {
      case "admin": return "default";
      case "moderator": return "secondary";
      case "editor": return "outline";
      default: return "secondary";
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-heading font-bold">Role Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Create New User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="w-40">
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => createAdmin.mutate()} disabled={!newEmail || !newPassword || newPassword.length < 8 || createAdmin.isPending}>
              {createAdmin.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No roles assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {roles.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{r.user_id}</span>
                    <Badge variant={roleColor(r.role) as any} className="text-xs capitalize">
                      {r.role}
                    </Badge>
                  </div>
                  {r.user_id !== user?.id && (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeRole.mutate(r.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
