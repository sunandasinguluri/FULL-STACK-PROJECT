import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, MapPin, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{user.name}</CardTitle>
                                <CardDescription className="capitalize">{user.role}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <User className="h-4 w-4" /> Full Name
                                </Label>
                                <Input defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email Address
                                </Label>
                                <Input defaultValue={user.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" /> Role
                                </Label>
                                <Input defaultValue={user.role} disabled className="capitalize" />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Primary Area
                                </Label>
                                <Input defaultValue={user.area || 'Not specified'} />
                            </div>
                        </div>
                    </CardContent>
                    <div className="p-6 border-t flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </Card>

                <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive text-lg">Danger Zone</CardTitle>
                        <CardDescription>Actions that cannot be undone.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive">Deactivate Account</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
