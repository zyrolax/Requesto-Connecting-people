import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
            <CardTitle>Terms of Service</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              By using Requesto you agree to these terms. If you do not agree, do not use the service.
            </p>
            <h2 className="text-2xl font-semibold mt-6">1. Use of the Service</h2>
            <p className="text-muted-foreground">
              Requesto connects users with professionals for advice and sessions. You must be at least 18 years old (or the age of majority in your jurisdiction) to use the service. You are responsible for the accuracy of your profile and for your conduct with other users.
            </p>
            <h2 className="text-2xl font-semibold mt-6">2. Booking and Payments</h2>
            <p className="text-muted-foreground">
              When you book a session, you agree to honor the professional's terms. Payment terms vary by provider and region.
            </p>
            <h2 className="text-2xl font-semibold mt-6">3. Refunds and Cancellations</h2>
            <p className="text-muted-foreground">
              Pricing is set by providers. Refund and cancellation policies are at the provider's discretion unless otherwise stated. Requesto may charge fees for use of the platform as described at the time of use.
            </p>
            <h3 className="text-foreground font-semibold">Termination</h3>
            <p>
              We may suspend or terminate your account for breach of these terms or for any other reason. You may stop using the service at any time.
            </p>
            <h3 className="text-foreground font-semibold">Contact</h3>
            <p>
              For questions about these terms, use the support link in the footer.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
