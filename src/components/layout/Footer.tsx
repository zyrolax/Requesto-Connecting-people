import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-semibold text-foreground">Requesto</p>
            <p className="text-sm text-muted-foreground mt-1">
              Connecting you with trusted professionals
            </p>
          </div>

          <p className="text-xs text-muted-foreground max-w-md">
            All professionals on our platform undergo a verification process. However, we recommend
            conducting your own due diligence before engaging any services.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Requesto. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
