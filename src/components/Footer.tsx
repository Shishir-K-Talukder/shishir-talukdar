import { FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="container flex flex-col items-center gap-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary" />
          <span>© 2024 Shishir Kumar Talukder. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <Link to="/research" className="hover:text-primary transition-colors">Research</Link>
          <Link to="/publications" className="hover:text-primary transition-colors">Publications</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
