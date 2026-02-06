import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComponentType } from "react";
import { UserPlus, Search, CalendarCheck, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps: { icon: ComponentType<{ className?: string }>; title: string; description: string }[] = [
  { icon: UserPlus, title: "1. Sign Up", description: "Create an account using your Google login to get started." },
  { icon: Search, title: "2. Find a Professional", description: "Browse our list of verified experts and choose the one that fits your needs." },
  { icon: CalendarCheck, title: "3. Book a Session", description: "Select a service (Call, Video, or Chat) and book directly through the platform." },
  { icon: Video, title: "4. Connect", description: "Join your video session directly from your Dashboard using our integrated video window." },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-6 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">How Requesto Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting with experts has never been easier. Follow these simple steps to get started.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/">Get Started Now</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
