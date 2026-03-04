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

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'citizen' as Role,
        area: '',
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Fake signup: just log them in
        login(formData.email, formData.role);
        toast.success('Account created successfully!');

        if (formData.role === 'citizen') navigate('/dashboard/citizen');
        else if (formData.role === 'politician') navigate('/dashboard/politician');
        else navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <Link to="/" className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-2xl italic">CV</span>
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Join CitizenVoice to start improving your community
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">I am a</Label>
                            <Select value={formData.role} onValueChange={(value: Role) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="citizen">Citizen</SelectItem>
                                    <SelectItem value="politician">Politician / Representative</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="area">Location / Constituency</Label>
                            <Input
                                id="area"
                                placeholder="e.g. Indiranagar, Bangalore"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full">Create Account</Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
