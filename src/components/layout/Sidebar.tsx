import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Home,
    FileText,
    MessageSquare,
    PlusCircle,
    Megaphone,
    User,
    AlertCircle,
    BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
    const { role } = useAuth();
    const location = useLocation();

    const citizenLinks = [
        { name: 'Home', href: '/dashboard/citizen', icon: Home },
        { name: 'Report Issue', href: '/report', icon: PlusCircle },
        { name: 'My Issues', href: '/issues', icon: FileText },
        { name: 'Updates', href: '/updates', icon: Megaphone },
        { name: 'Feedback', href: '/feedback', icon: MessageSquare },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const politicianLinks = [
        { name: 'Dashboard', href: '/dashboard/politician', icon: BarChart3 },
        { name: 'Citizen Issues', href: '/dashboard/politician/issues', icon: AlertCircle },
        { name: 'Post Update', href: '/updates/new', icon: PlusCircle },
        { name: 'My Updates', href: '/updates', icon: Megaphone },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const links = role === 'politician' ? politicianLinks : citizenLinks;

    return (
        <div className={cn("pb-12 h-full flex flex-col", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Menu
                    </h2>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <Button
                                key={link.href}
                                variant={location.pathname === link.href ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                asChild
                                onClick={onClose}
                            >
                                <Link to={link.href}>
                                    <link.icon className="mr-2 h-4 w-4" />
                                    {link.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 border-t">
                <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
                    <p className="font-medium">CitizenVoice v1.0</p>
                    <p className="text-muted-foreground">Connecting you to change.</p>
                </div>
            </div>
        </div>
    );
}
