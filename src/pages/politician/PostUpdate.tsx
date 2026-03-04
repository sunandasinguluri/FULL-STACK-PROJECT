import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Megaphone, Send, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animations/PageTransition';

export default function PostUpdate() {
    const { user } = useAuth();
    const { addUpdate } = useStore();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !user) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            addUpdate({
                title,
                content,
                politicianId: user.id,
                politicianName: user.name,
                image: image || undefined,
            });
            toast.success('Update posted successfully!');
            navigate('/updates');
        } catch (error) {
            toast.error('Failed to post update');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageTransition className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full h-12 w-12 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-4xl font-black tracking-tight leading-none mb-2">
                        Post <span className="text-gradient">Update</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Share an announcement with your constituency.</p>
                </div>
            </div>

            <Card className="glass-card border-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-10 pb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-lg shadow-vibrant-blue/20">
                            <Megaphone className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black">Create Announcement</CardTitle>
                            <CardDescription className="text-base font-medium">Fill in the details below to reach your citizens.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Update Title</Label>
                            <Input
                                id="title"
                                placeholder="E.g., New Community Park Opening Next Week"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-14 rounded-2xl border-2 border-border/50 bg-background/50 font-bold text-lg focus-visible:ring-primary shadow-sm"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="content" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Announcement Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Describe the update in detail..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[200px] rounded-3xl border-2 border-border/50 bg-background/50 font-medium text-base focus-visible:ring-primary shadow-sm resize-none p-6"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="image" className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Image URL (Optional)</Label>
                            <div className="relative">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="image"
                                    placeholder="Paste an image URL here..."
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="pl-12 h-14 rounded-2xl border-2 border-border/50 bg-background/50 font-bold focus-visible:ring-primary shadow-sm"
                                />
                                {image && (
                                    <button
                                        type="button"
                                        onClick={() => setImage('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {image && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-3xl overflow-hidden border-2 border-border/50 bg-muted/30 aspect-video relative group"
                            >
                                <img src={image} alt="Preview" className="w-full h-full object-cover" onError={() => toast.error('Invalid image URL')} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-black text-sm uppercase tracking-widest">Image Preview</span>
                                </div>
                            </motion.div>
                        )}

                        <div className="pt-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-16 rounded-2xl gradient-primary border-none shadow-xl shadow-vibrant-blue/20 text-xl font-black gap-3"
                                >
                                    {isSubmitting ? 'Posting...' : (
                                        <>
                                            Post Announcement
                                            <Send className="h-6 w-6" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </PageTransition>
    );
}
