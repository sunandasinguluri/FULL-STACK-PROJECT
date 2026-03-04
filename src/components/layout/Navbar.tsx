import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, Menu, Bell, LogOut, User } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 w-full border-b glass">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted/50 transition-colors" onClick={onMenuClick}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-vibrant-blue/30 group-hover:scale-110 transition-transform">
                            <span className="text-white font-black text-xs italic">CV</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter hidden sm:inline-block">Citizen<span className="text-primary">Voice</span></span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 hover:bg-muted/50 transition-colors"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        title="Toggle theme"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {user ? (
                        <>
                            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-muted/50">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 border-2 border-primary/20 hover:border-primary/50 transition-all">
                                        <Avatar className="h-11 w-11">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 glass border-border/50 mt-2" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal p-4">
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-sm font-black leading-none">{user.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider leading-relaxed">
                                                    {user.role}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-border/50" />
                                    <DropdownMenuGroup className="p-1">
                                        <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer py-3 transition-colors">
                                            <Link to="/profile" className="flex items-center w-full">
                                                <User className="mr-3 h-4 w-4" />
                                                <span className="font-semibold">Profile Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-border/50" />
                                    <div className="p-1">
                                        <DropdownMenuItem
                                            className="text-destructive rounded-lg focus:bg-destructive/10 focus:text-destructive cursor-pointer py-3 font-bold transition-colors"
                                            onClick={logout}
                                        >
                                            <LogOut className="mr-3 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild className="rounded-full px-6 font-semibold hidden sm:flex">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild className="rounded-full px-6 gradient-primary border-none shadow-lg shadow-vibrant-blue/20 font-bold hover:scale-105 transition-transform">
                                <Link to="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
