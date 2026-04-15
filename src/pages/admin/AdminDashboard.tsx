import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, FileText, Image, Search, Lock, Microscope, BookOpen, Building2, PenSquare, Megaphone } from "lucide-react";
import ContentEditor from "./ContentEditor";
import SEOEditor from "./SEOEditor";
import ImageManager from "./ImageManager";
import ChangePassword from "./ChangePassword";
import ResearchEditor from "./ResearchEditor";
import PublicationsEditor from "./PublicationsEditor";
import CollaborationsEditor from "./CollaborationsEditor";
import BlogEditor from "./BlogEditor";
import AdsEditor from "./AdsEditor";
import { SktLogo } from "@/components/SktLogo";
import { FloatingMicrobes } from "@/components/FloatingMicrobes";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "blog", label: "Blog", icon: PenSquare },
  { value: "research", label: "Research", icon: Microscope },
  { value: "publications", label: "Publications", icon: BookOpen },
  { value: "collaborations", label: "Collaborations", icon: Building2 },
  { value: "content", label: "Content", icon: FileText },
  { value: "images", label: "Media", icon: Image },
  { value: "ads", label: "Ads", icon: Megaphone },
  { value: "seo", label: "SEO", icon: Search },
  { value: "settings", label: "Security", icon: Lock },
];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("blog");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingMicrobes count={3} className="opacity-30" />

      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <SktLogo className="h-7 w-7" />
            <h1 className="font-heading font-bold text-lg">Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Sidebar-style horizontal nav */}
          <div className="overflow-x-auto -mx-4 px-4 pb-1">
            <TabsList className="inline-flex w-auto h-auto gap-1 bg-card/60 backdrop-blur-md p-1.5 rounded-xl border border-border/40">
              {tabs.map(t => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className={cn(
                    "gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all",
                    "data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  )}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="blog"><BlogEditor /></TabsContent>
          <TabsContent value="research"><ResearchEditor /></TabsContent>
          <TabsContent value="publications"><PublicationsEditor /></TabsContent>
          <TabsContent value="collaborations"><CollaborationsEditor /></TabsContent>
          <TabsContent value="content"><ContentEditor /></TabsContent>
          <TabsContent value="images"><ImageManager /></TabsContent>
          <TabsContent value="ads"><AdsEditor /></TabsContent>
          <TabsContent value="seo"><SEOEditor /></TabsContent>
          <TabsContent value="settings"><ChangePassword /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
