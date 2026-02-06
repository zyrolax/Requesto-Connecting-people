import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-3xl mx-auto p-6 space-y-6">
        <Button variant="ghost" asChild className="w-fit pl-0">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              Requesto (“we”) respects your privacy. This policy describes how we collect, use, and protect your information when you use our platform.
            </p>
            <h3 className="text-foreground font-semibold">Information we collect</h3>
            <p>
              When you sign in with Google, we receive your name, email, and profile picture. We store this to provide your account and display your profile (for providers). We do not sell your data to third parties.
            </p>
            <h3 className="text-foreground font-semibold">How we use it</h3>
            <p>
              We use your information to operate the service (e.g. bookings, video links, provider profiles) and to communicate with you about your account. We may use cookies or similar tech for session and preferences.
            </p>
            <h3 className="text-foreground font-semibold">Data retention & security</h3>
            <p>
              We retain your data while your account is active. You can request deletion by contacting support. We use reasonable measures to protect your data; no system is 100% secure.
            </p>
            <h3 className="text-foreground font-semibold">Contact</h3>
            <p>
              For privacy questions or requests, contact us at the support link in the footer.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
