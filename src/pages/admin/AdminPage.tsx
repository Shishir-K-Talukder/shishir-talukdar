import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const { data: adminRole, isLoading: isCheckingRole } = useQuery({
    queryKey: ["admin-access", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (loading || (user && isCheckingRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-80">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!adminRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 text-center shadow-sm">
          <h1 className="text-xl font-heading font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account is signed in, but it does not have admin permissions for the dashboard.
          </p>
          <Button className="mt-6 w-full" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}
