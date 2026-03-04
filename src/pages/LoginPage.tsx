import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Role } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animations/PageTransition';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('citizen');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }
        login(email, role);
        toast.success('Logged in successfully!');

        // Redirect based on role
        if (role === 'citizen') navigate('/dashboard/citizen');
        else if (role === 'politician') navigate('/dashboard/politician');
        else navigate('/');
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 animate-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vibrant-indigo/10 rounded-full blur-[100px] -z-10 animate-glow" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-[440px] z-10">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary mb-6 shadow-xl shadow-vibrant-blue/20"
                    >
                        <Link to="/" className="text-white font-black text-2xl italic">CV</Link>
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground font-medium">Empowering communities, one voice at a time.</p>
                </div>

                <Card className="glass-card border-2 border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                    <form onSubmit={handleLogin}>
                        <CardHeader className="pt-10 text-center pb-2">
                            <CardTitle className="text-2xl font-black">Sign In</CardTitle>
                            <CardDescription className="font-medium">
                                Choose your role and enter your credentials
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="role" className="font-bold ml-1">Login as</Label>
                                <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                                    <SelectTrigger id="role" className="h-12 rounded-xl border-2 border-border/50 bg-background/50 font-bold focus:ring-primary">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="glass">
                                        <SelectItem value="citizen" className="font-medium">Citizen</SelectItem>
                                        <SelectItem value="politician" className="font-medium">Politician</SelectItem>
                                        <SelectItem value="moderator" className="font-medium">Moderator</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-bold ml-1">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-11 h-12 rounded-xl border-2 border-border/50 bg-background/50 focus-visible:ring-primary focus-visible:border-primary transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <Label htmlFor="password" title="" className="font-bold">Password</Label>
                                    <Link to="#" className="text-xs text-primary font-bold hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-11 h-12 rounded-xl border-2 border-border/50 bg-background/50 focus-visible:ring-primary"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-6 pb-12 pt-6">
                            <Button type="submit" className="w-full h-14 rounded-full text-lg font-black gradient-primary border-none shadow-lg shadow-vibrant-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Login <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <div className="text-center text-sm text-muted-foreground font-medium">
                                New here?{' '}
                                <Link to="/signup" className="text-primary hover:underline font-black">
                                    Join the community
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </PageTransition>
    );
}
