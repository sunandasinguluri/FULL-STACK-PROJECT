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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Issue } from '@/lib/mockData';
import { format } from 'date-fns';
import { Eye, ThumbsUp, MessageSquare, Search, ArrowUpDown } from 'lucide-react';

export default function MyIssues() {
    const { user } = useAuth();
    const { issues, comments, addComment } = useStore();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [commentText, setCommentText] = useState('');

    const data = useMemo(() => issues.filter(i => i.reportedBy === user?.id), [issues, user]);

    const columns = useMemo<ColumnDef<Issue>[]>(() => [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
        },
        {
            accessorKey: 'category',
            header: 'Category',
        },
        {
            accessorKey: 'status',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <div className={`px-2 py-1 rounded-full text-[10px] w-fit font-bold uppercase ${status === 'resolved' ? 'bg-green-100 text-green-700' :
                        status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {status}
                    </div>
                );
            },
        },
        {
            accessorKey: 'reportedAt',
            header: 'Date',
            cell: ({ row }) => format(new Date(row.original.reportedAt), 'MMM d, yyyy'),
        },
        {
            accessorKey: 'upvotes',
            header: 'Upvotes',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                    {row.original.upvotes}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" onClick={() => setSelectedIssue(row.original)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                </Button>
            ),
        },
    ], []);

    const table = useReactTable({
        data,
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

    const handleAddComment = () => {
        if (!commentText.trim() || !selectedIssue || !user) return;
        addComment(selectedIssue.id, user.id, user.name, user.role, commentText);
        setCommentText('');
    };

    const issueComments = useMemo(() =>
        comments.filter(c => c.issueId === selectedIssue?.id),
        [comments, selectedIssue]
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold">My Reported Issues</h1>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search issues..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No issues found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Issue Detail Dialog */}
            <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    {selectedIssue && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`px-2 py-0.5 rounded-full text-[10px] w-fit font-bold uppercase ${selectedIssue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                        selectedIssue.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {selectedIssue.status}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{selectedIssue.category}</span>
                                </div>
                                <DialogTitle className="text-2xl">{selectedIssue.title}</DialogTitle>
                                <DialogDescription>
                                    Reported on {format(new Date(selectedIssue.reportedAt), 'PPP')} • {selectedIssue.location}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-4">
                                {selectedIssue.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedIssue.images.map((img, i) => (
                                            <img key={i} src={img} alt="Issue" className="rounded-lg object-cover h-40 w-full" />
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">{selectedIssue.description}</p>
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Comments ({issueComments.length})
                                    </h4>
                                    <div className="space-y-4 mb-6">
                                        {issueComments.map(comment => (
                                            <div key={comment.id} className="flex gap-3">
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                                    {comment.userName.charAt(0)}
                                                </div>
                                                <div className="flex-1 bg-muted/50 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold">{comment.userName} <span className="text-[10px] font-normal text-muted-foreground capitalize">({comment.userRole})</span></span>
                                                        <span className="text-[10px] text-muted-foreground">{format(new Date(comment.createdAt), 'MMM d, HH:mm')}</span>
                                                    </div>
                                                    <p className="text-sm">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add a comment..."
                                            value={commentText}
                                            onChange={e => setCommentText(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                                        />
                                        <Button size="sm" onClick={handleAddComment}>Send</Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
