import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
    PlusCircle,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Megaphone,
    ArrowUp,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animations/PageTransition';

export default function CitizenDashboard() {
    const { user } = useAuth();
    const { issues, upvoteIssue } = useStore();

    const userIssues = issues.filter(i => i.reportedBy === user?.id);
    const resolvedCount = userIssues.filter(i => i.status === 'resolved').length;
    const inProgressCount = userIssues.filter(i => i.status === 'in-progress').length;
    const openCount = userIssues.filter(i => i.status === 'open').length;

    const trendingIssues = [...issues].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

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
        <PageTransition className="space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight leading-none mb-2">
                        Welcome back, <span className="text-gradient leading-relaxed">{user?.name.split(' ')[0]}</span>!
                    </h1>
                    <p className="text-muted-foreground font-medium">Your contribution counts in <span className="text-foreground font-bold">{user?.area}</span>.</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild className="rounded-full h-14 px-8 gradient-primary border-none shadow-xl shadow-vibrant-blue/20 font-black text-lg">
                        <Link to="/report">
                            <PlusCircle className="mr-2 h-6 w-6" />
                            Report Now
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-3"
            >
                <StatsCard
                    variants={itemVariants}
                    title="Issues Reported"
                    value={userIssues.length.toString()}
                    icon={AlertCircle}
                    description="Total issues you've filed"
                />
                <StatsCard
                    variants={itemVariants}
                    title="Successfully Resolved"
                    value={resolvedCount.toString()}
                    icon={CheckCircle2}
                    description="Issues fixed by authorities"
                    color="text-green-500"
                />
                <StatsCard
                    variants={itemVariants}
                    title="Active Processing"
                    value={(inProgressCount + openCount).toString()}
                    icon={Clock}
                    description="Issues currently being addressed"
                    color="text-amber-500"
                />
            </motion.div>

            <div className="grid gap-10 md:grid-cols-2">
                {/* Trending Issues */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        Trending Local Concerns
                    </h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-5"
                    >
                        {trendingIssues.map((issue) => (
                            <MotionCard
                                key={issue.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                className="overflow-hidden glass-card border-border/50 rounded-3xl p-0 shadow-lg"
                            >
                                <CardContent className="p-6 flex gap-6">
                                    <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-2xl min-w-[70px] border border-primary/10">
                                        <motion.button
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.8 }}
                                            className="h-10 w-10 p-0 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors"
                                            onClick={() => upvoteIssue(issue.id)}
                                        >
                                            <ArrowUp className="h-6 w-6" />
                                        </motion.button>
                                        <span className="font-black text-xl leading-none mt-1">{issue.upvotes}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-xl leading-tight mb-2 tracking-tight">{issue.title}</h3>
                                        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed mb-4">{issue.description}</p>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest ${issue.status === 'resolved' ? 'bg-green-500/10 text-green-600' :
                                                issue.status === 'in-progress' ? 'bg-amber-500/10 text-amber-600' :
                                                    'bg-red-500/10 text-red-600'
                                                }`}>
                                                {issue.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                {formatDistanceToNow(new Date(issue.reportedAt))} ago
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </MotionCard>
                        ))}
                    </motion.div>
                    <Button variant="link" asChild className="p-0 h-auto text-primary font-black text-base hover:no-underline group">
                        <Link to="/issues" className="flex items-center">
                            View all community concerns <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                {/* Quick Actions / Info */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <QuickActionCard
                            to="/report"
                            icon={PlusCircle}
                            label="Report Problem"
                            desc="Fast-track local fixes"
                            color="bg-vibrant-blue/10 text-vibrant-blue"
                        />
                        <QuickActionCard
                            to="/updates"
                            icon={Megaphone}
                            label="Local Updates"
                            desc="Political announcements"
                            color="bg-vibrant-indigo/10 text-vibrant-indigo"
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-8 bg-gradient-to-br from-primary/5 to-vibrant-indigo/5 border-primary/20 rounded-[2.5rem] p-10 relative overflow-hidden group border-2"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <BarChart3 className="h-24 w-24" />
                        </div>
                        <h3 className="text-lg font-black flex items-center gap-3 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            Impact Tracker
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground font-medium mb-6">
                            Your reports have directly influenced 2 community improvements this month. High-quality reports with photos are resolved 30% faster!
                        </p>
                        <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden border border-border/50 shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                className="h-full gradient-primary rounded-full shadow-lg shadow-vibrant-blue/20"
                            />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-3 text-right">65% Progress to Gold badge</p>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
}

function StatsCard({ title, value, icon: Icon, description, color, variants }: any) {
    return (
        <MotionCard variants={variants} className="glass-card border-border/50 rounded-[2rem] overflow-hidden group shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
                <div className="p-2.5 bg-muted/50 rounded-xl group-hover:bg-primary/5 transition-colors">
                    <Icon className={`h-5 w-5 ${color || 'text-muted-foreground'}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black tracking-tight">{value}</div>
                <p className="text-[11px] font-bold text-muted-foreground mt-1 opacity-80">{description}</p>
            </CardContent>
        </MotionCard>
    );
}

function QuickActionCard({ to, icon: Icon, label, desc, color }: any) {
    return (
        <motion.div whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
            <Link to={to} className="group block h-full">
                <div className="glass-card border-border/50 rounded-3xl p-8 h-full flex flex-col items-center text-center gap-4 shadow-md hover:shadow-xl transition-all">
                    <div className={`h-16 w-16 rounded-2xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                        <Icon className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <span className="font-black text-lg leading-none">{label}</span>
                        <p className="text-xs text-muted-foreground font-medium">{desc}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

const MotionCard = motion(Card);

function ShieldCheck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}


