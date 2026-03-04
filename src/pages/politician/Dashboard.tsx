import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Issue, IssueStatus } from '@/lib/mockData';
import { format } from 'date-fns';
import { MessageSquare, CheckCircle2, Clock, Eye, Send, TrendingUp, BarChart3, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/animations/PageTransition';

export default function PoliticianDashboard() {
    const { user } = useAuth();
    const { issues, updateIssueStatus, addComment, comments } = useStore();
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [replyText, setReplyText] = useState('');

    // Stats
    const totalIssues = issues.length;
    const pendingIssues = issues.filter(i => i.status !== 'resolved').length;
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length;

    const handleUpdateStatus = (id: string, status: IssueStatus) => {
        updateIssueStatus(id, status);
        toast.success(`Status updated to ${status}`);
        if (selectedIssue?.id === id) {
            setSelectedIssue(prev => prev ? { ...prev, status } : null);
        }
    };

    const handleSendReply = () => {
        if (!replyText.trim() || !selectedIssue || !user) return;
        addComment(selectedIssue.id, user.id, user.name, user.role, replyText);
        setReplyText('');
        toast.success('Reply sent to citizen');
    };

    const issueComments = useMemo(() =>
        comments.filter(c => c.issueId === selectedIssue?.id),
        [comments, selectedIssue]
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <PageTransition className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        Constituency <span className="text-gradient">Overview</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Manage issues and connect with your citizens.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl glass border-2 font-bold px-6">
                        Export Reports
                    </Button>
                    <Button asChild className="rounded-xl gradient-primary border-none shadow-lg shadow-vibrant-blue/20 font-bold px-6">
                        <Link to="/updates/new">Post Announcement</Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:grid-cols-3"
            >
                <StatsCard
                    variants={itemVariants}
                    title="Total Issues"
                    value={totalIssues.toString()}
                    icon={BarChart3}
                    color="text-vibrant-blue"
                />
                <StatsCard
                    variants={itemVariants}
                    title="Pending Action"
                    value={pendingIssues.toString()}
                    icon={Clock}
                    color="text-amber-500"
                />
                <StatsCard
                    variants={itemVariants}
                    title="Resolved"
                    value={resolvedIssues.toString()}
                    icon={CheckCircle2}
                    color="text-green-500"
                />
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Issues Table */}
                <Card className="lg:col-span-2 glass-card border-border/50 rounded-3xl overflow-hidden shadow-xl">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl font-bold">Recent Citizen Issues</CardTitle>
                        <CardDescription className="font-medium text-muted-foreground">A list of issues reported by citizens in your constituency.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/20">
                                    <TableRow className="border-border/50">
                                        <TableHead className="font-bold py-4">Issue</TableHead>
                                        <TableHead className="font-bold py-4">Category</TableHead>
                                        <TableHead className="font-bold py-4">Status</TableHead>
                                        <TableHead className="text-right font-bold py-4 pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {issues.map((issue, idx) => (
                                            <motion.tr
                                                key={issue.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="border-border/30 hover:bg-primary/5 transition-colors cursor-default"
                                            >
                                                <TableCell className="font-bold py-4">{issue.title}</TableCell>
                                                <TableCell className="font-medium text-muted-foreground">{issue.category}</TableCell>
                                                <TableCell>
                                                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] w-fit font-black uppercase tracking-wider ${issue.status === 'resolved' ? 'bg-green-500/10 text-green-600' :
                                                        issue.status === 'in-progress' ? 'bg-amber-500/10 text-amber-600' :
                                                            'bg-red-500/10 text-red-600'
                                                        }`}>
                                                        {issue.status}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right py-4 pr-6">
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedIssue(issue)} className="rounded-lg h-9 font-bold text-primary hover:text-primary hover:bg-primary/10">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Manage
                                                    </Button>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Insights Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Constituency Insights</h2>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-[2rem] border-border/50 p-8 space-y-8 shadow-lg"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Resolution Rate</span>
                                <span className="text-2xl font-black text-primary">{Math.round((resolvedIssues / (totalIssues || 1)) * 100)}%</span>
                            </div>
                            <div className="h-4 w-full bg-muted/50 rounded-full overflow-hidden border border-border/30">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(resolvedIssues / (totalIssues || 1)) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                    className="h-full gradient-primary rounded-full shadow-inner shadow-white/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-5 pt-2">
                            <InsightItem
                                icon={TrendingUp}
                                label="Top Concern"
                                value="Infrastructure"
                                color="bg-orange-500/10 text-orange-500"
                            />
                            <InsightItem
                                icon={Users}
                                label="Avg. Resolution"
                                value="4.2 Days"
                                color="bg-vibrant-indigo/10 text-vibrant-indigo"
                            />
                        </div>

                        <div className="p-5 bg-vibrant-blue/5 rounded-2xl border border-vibrant-blue/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <p className="text-xs font-black text-vibrant-blue uppercase tracking-wider mb-1">Performance Badge</p>
                            <p className="text-sm font-bold leading-relaxed text-vibrant-blue/80">
                                Efficiency is up by 15% this month! You are in the top tier of representatives.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Issue Management Drawer/Dialog */}
            <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass border-border/50 rounded-3xl p-0">
                    {selectedIssue && (
                        <>
                            <div className="p-8 bg-muted/20 border-b border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black tracking-tight">{selectedIssue.title}</DialogTitle>
                                    <DialogDescription className="text-base font-medium">
                                        Manage this issue and provide updates to the citizen.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-6 bg-muted/10 p-5 rounded-2xl border border-border/50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Category</p>
                                        <p className="text-base font-bold">{selectedIssue.category}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Location</p>
                                        <p className="text-base font-bold">{selectedIssue.location}, {selectedIssue.pincode}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Current Status</Label>
                                    <Select
                                        defaultValue={selectedIssue.status}
                                        onValueChange={(val: IssueStatus) => handleUpdateStatus(selectedIssue.id, val)}
                                    >
                                        <SelectTrigger className="h-14 rounded-xl border-2 border-border/50 bg-background/50 font-black text-lg focus:ring-primary shadow-sm hover:border-primary/50 transition-colors">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="glass">
                                            <SelectItem value="open" className="font-bold py-3">Open</SelectItem>
                                            <SelectItem value="in-progress" className="font-bold py-3">In Progress</SelectItem>
                                            <SelectItem value="resolved" className="font-bold py-3">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="border border-border/50 rounded-3xl p-6 bg-card/30 backdrop-blur-sm">
                                    <h4 className="text-base font-black mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        Citizen Discussion
                                    </h4>
                                    <div className="space-y-6 max-h-[300px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                                        {issueComments.map(c => (
                                            <div key={c.id} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-black text-sm">{c.userName}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(new Date(c.createdAt), 'MMM d, HH:mm')}</span>
                                                </div>
                                                <div className={`p-4 rounded-2xl ${c.userId === user?.id ? 'bg-primary/10 border-primary/20 mr-4' : 'bg-muted/50 border-border/30 ml-4'} border font-medium text-sm`}>
                                                    {c.text}
                                                </div>
                                            </div>
                                        ))}
                                        {issueComments.length === 0 && (
                                            <div className="text-center py-10">
                                                <p className="text-muted-foreground font-bold italic">No discussion yet. Be the first to reply!</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t border-border/30">
                                        <Input
                                            placeholder="Type your official reply..."
                                            className="h-14 rounded-2xl border-2 border-border/50 bg-background/80 font-medium focus-visible:ring-primary shadow-sm"
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                        />
                                        <Button className="h-14 w-14 rounded-2xl gradient-primary border-none shadow-lg shadow-vibrant-blue/20 shrink-0" onClick={handleSendReply}>
                                            <Send className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-muted/20 border-t border-border/50 flex justify-end">
                                <Button variant="outline" onClick={() => setSelectedIssue(null)} className="rounded-xl h-12 px-8 font-black hover:bg-background transition-colors">Close Overview</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </PageTransition>
    );
}

function StatsCard({ title, value, icon: Icon, color, variants }: any) {
    return (
        <MotionCard variants={variants} className="glass-card border-border/50 rounded-[2rem] overflow-hidden group shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">{title}</CardTitle>
                <div className="p-2.5 bg-muted/50 rounded-xl group-hover:bg-primary/5 transition-colors">
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black">{value}</div>
            </CardContent>
        </MotionCard>
    );
}

function InsightItem({ icon: Icon, label, value, color }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-lg font-black">{value}</p>
            </div>
        </div>
    );
}

const MotionCard = motion(Card);
