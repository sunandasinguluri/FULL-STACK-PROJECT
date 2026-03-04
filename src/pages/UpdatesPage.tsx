import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, Calendar, User } from 'lucide-react';

export default function UpdatesPage() {
    const { updates, likeUpdate } = useStore();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Latest Announcements</h1>
                <p className="text-muted-foreground">Stay updated with news from your representatives.</p>
            </div>

            <div className="space-y-6">
                {updates.map((update) => (
                    <Card key={update.id} className="overflow-hidden">
                        <CardHeader className="bg-primary/5">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{update.title}</CardTitle>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(update.date))} ago
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{update.politicianName}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                                {update.content}
                            </p>
                            {update.image && (
                                <img
                                    src={update.image}
                                    alt="Update"
                                    className="mt-4 rounded-lg object-cover w-full h-64 shadow-sm"
                                />
                            )}
                        </CardContent>
                        <CardFooter className="border-t bg-muted/20 px-6 py-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={() => likeUpdate(update.id)}
                            >
                                <ThumbsUp className="h-4 w-4" />
                                Useful ({update.likes})
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
