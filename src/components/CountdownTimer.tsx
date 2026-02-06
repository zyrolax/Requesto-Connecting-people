import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    startDate: string | Date;
    durationMinutes?: number;
    onExpire?: () => void;
}

export function CountdownTimer({ startDate, durationMinutes = 60, onExpire }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const start = new Date(startDate).getTime();
        const expiry = start + durationMinutes * 60 * 1000;

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = expiry - now;

            if (difference <= 0) {
                setTimeLeft(0);
                onExpire?.();
            } else {
                setTimeLeft(difference);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startDate, durationMinutes, onExpire]);

    if (timeLeft <= 0) return null;

    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)));

    return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>
                {hours > 0 && `${hours}h `}
                {minutes}m {seconds}s left
            </span>
        </div>
    );
}
