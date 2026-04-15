import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, FileText, Image, Search, Lock, FlaskConical } from "lucide-react";
import ContentEditor from "./ContentEditor";
import SEOEditor from "./SEOEditor";
import ImageManager from "./ImageManager";
import ChangePassword from "./ChangePassword";
import { FloatingMicrobes } from "@/components/FloatingMicrobes";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingMicrobes count={5} className="opacity-50" />

      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h1 className="font-heading font-bold text-lg">Research Dashboard</h1>
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
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-card/80 backdrop-blur">
            <TabsTrigger value="content" className="gap-1">
              <FileText className="h-4 w-4" /> Content
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-1">
              <Search className="h-4 w-4" /> SEO
            </TabsTrigger>
            <TabsTrigger value="images" className="gap-1">
              <Image className="h-4 w-4" /> Images
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1">
              <Lock className="h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>
          <TabsContent value="seo">
            <SEOEditor />
          </TabsContent>
          <TabsContent value="images">
            <ImageManager />
          </TabsContent>
          <TabsContent value="settings">
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
