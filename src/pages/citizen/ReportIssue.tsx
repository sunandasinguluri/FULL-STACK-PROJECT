import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/mockData';
import { toast } from 'sonner';
import { Camera, X, Loader2 } from 'lucide-react';

export default function ReportIssue() {
    const { user } = useAuth();
    const { addIssue } = useStore();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        pincode: '',
    });

    const [images, setImages] = useState<string[]>([]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            addIssue({
                ...formData,
                reportedBy: user?.id || 'unknown',
                images: images,
            });

            toast.success('Issue reported successfully!');
            setIsSubmitting(false);
            navigate('/issues');
        }, 1500);
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Report an Issue</CardTitle>
                    <CardDescription>
                        Help your community by identifying problems that need attention.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Issue Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Large pothole blocking traffic"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={value => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input
                                    id="pincode"
                                    placeholder="e.g. 560038"
                                    value={formData.pincode}
                                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Specific Location / Landmark</Label>
                            <Input
                                id="location"
                                placeholder="e.g. Near Indiranagar Metro Station exit"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Detailed Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the problem in detail..."
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Photos (Optional)</Label>
                            <div className="flex flex-wrap gap-4">
                                {images.map((src, index) => (
                                    <div key={index} className="relative h-24 w-24 rounded-lg overflow-hidden border">
                                        <img src={src} alt="Issue preview" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-background"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="h-24 w-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                    <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                                    <span className="text-[10px] text-muted-foreground font-medium">Add Photo</span>
                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-6 mt-6">
                        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Report
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
