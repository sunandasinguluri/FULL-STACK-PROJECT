import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/store/useStore';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    type SortingState,
    getFilteredRowModel,
    type ColumnDef
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Issue, IssueStatus } from '@/lib/mockData';
import { format } from 'date-fns';
import { Eye, MessageSquare, Search, ArrowUpDown, Send } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/animations/PageTransition';

export default function PoliticianIssues() {
    const { user } = useAuth();
    const { issues, comments, addComment, updateIssueStatus } = useStore();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [replyText, setReplyText] = useState('');

    const columns = useMemo<ColumnDef<Issue>[]>(() => [
        {
            accessorKey: 'title',
            header: 'Issue Title',
            cell: ({ row }) => <span className="font-bold text-foreground">{row.original.title}</span>,
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => <span className="font-medium text-muted-foreground">{row.original.category}</span>,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-bold"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] w-fit font-black uppercase tracking-wider ${status === 'resolved' ? 'bg-green-500/10 text-green-600' :
                            status === 'in-progress' ? 'bg-amber-500/10 text-amber-600' :
                                'bg-red-500/10 text-red-600'
                        }`}>
                        {status}
                    </div>
                );
            },
        },
        {
            accessorKey: 'reportedAt',
            header: 'Date Reported',
            cell: ({ row }) => <span className="text-sm font-medium">{format(new Date(row.original.reportedAt), 'MMM d, yyyy')}</span>,
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => <span className="text-sm font-medium">{row.original.location}</span>,
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedIssue(row.original)}
                        className="rounded-lg h-9 font-bold text-primary hover:text-primary hover:bg-primary/10"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Manage
                    </Button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: issues,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter,
        },
    });

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

    return (
        <PageTransition className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight leading-none mb-2">
                        Citizen <span className="text-gradient">Issues</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Review and resolve reported concerns in your constituency.</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search issues, locations..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-12 h-14 rounded-2xl border-2 border-border/50 bg-background/50 focus-visible:ring-primary shadow-sm"
                    />
                </div>
            </div>

            <div className="glass-card border-border/50 rounded-3xl overflow-hidden shadow-xl">
                <Table>
                    <TableHeader className="bg-muted/30">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-border/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="py-5 px-6 font-black text-xs uppercase tracking-widest text-muted-foreground">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, idx) => (
                                    <motion.tr
                                        key={row.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="border-border/30 hover:bg-primary/5 transition-colors cursor-default"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-5 px-6">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-40 text-center">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground font-bold">
                                            <Search className="h-8 w-8 opacity-20" />
                                            No issues found matching your criteria.
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            {/* Same Issue Management Dialog as in Dashboard */}
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
