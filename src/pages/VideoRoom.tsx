import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function VideoRoom() {
  const { meetId } = useParams();
  const validId = meetId && UUID_REGEX.test(meetId);
  const meetUrl = validId ? `https://meet.jit.si/${meetId}#config.prejoinPageEnabled=false` : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col bg-gray-900">
        {validId && meetUrl ? (
          <div className="flex-1 relative min-h-[calc(100vh-4rem)]">
            <iframe
              src={meetUrl}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              className="absolute inset-0 w-full h-full border-0"
              title="Video Meeting"
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Invalid or missing meeting link.</p>
              <Button asChild>
                <Link to="/dashboard" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
