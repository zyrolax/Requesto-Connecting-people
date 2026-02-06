import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-2xl mx-auto p-6 space-y-6">
        <Button variant="ghost" asChild className="w-fit pl-0">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>We’re here to help with account, bookings, and technical issues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  For account, billing, or safety issues, email us at{" "}
                  <a href="mailto:support@requesto.example.com" className="text-primary hover:underline">
                    support@requesto.example.com
                  </a>
                  . We aim to respond within 1–2 business days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-muted-foreground">
                  Check <Link to="/how-it-works" className="text-primary hover:underline">How it works</Link> for common questions about signing up, booking, and video sessions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
