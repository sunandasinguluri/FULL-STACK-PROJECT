import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_USERS } from '@/lib/mockData';
import { Star, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackPage() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const politicians = MOCK_USERS.filter(u => u.role === 'politician');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please provide a star rating');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            toast.success('Thank you for your feedback! It has been submitted.');
            setIsSubmitting(false);
            setRating(0);
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Provide Feedback</CardTitle>
                    <CardDescription>
                        Share your thoughts on the performance of your elected representatives.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="politician">Select Representative</Label>
                            <Select required>
                                <SelectTrigger id="politician">
                                    <SelectValue placeholder="Chose a representative" />
                                </SelectTrigger>
                                <SelectContent>
                                    {politicians.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label>Overall Satisfaction</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        <Star
                                            className={`h-8 w-8 ${star <= (hover || rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-muted-foreground'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">Click on the stars to rate.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Your Comments</Label>
                            <Textarea
                                id="comment"
                                placeholder="What are they doing well? What can be improved?"
                                rows={5}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end p-6 border-t">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="mr-2 h-4 w-4" />
                            )}
                            Submit Feedback
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
