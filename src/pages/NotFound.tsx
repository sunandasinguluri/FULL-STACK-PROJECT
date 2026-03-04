import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-6">
                <h1 className="text-9xl font-extrabold text-primary/20 italic">404</h1>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold">Page Not Found</h2>
                    <p className="text-muted-foreground max-w-md">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
