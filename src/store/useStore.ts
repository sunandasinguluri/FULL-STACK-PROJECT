import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_ISSUES, MOCK_UPDATES, MOCK_COMMENTS } from '@/lib/mockData';
import type { Issue, IssueStatus, Update, Comment } from '@/lib/mockData';

interface IssueState {
    issues: Issue[];
    updates: Update[];
    comments: Comment[];
    addIssue: (issue: Omit<Issue, 'id' | 'status' | 'upvotes' | 'reportedAt'>) => void;
    updateIssueStatus: (id: string, status: IssueStatus) => void;
    upvoteIssue: (id: string) => void;
    addUpdate: (update: Omit<Update, 'id' | 'likes' | 'date'>) => void;
    likeUpdate: (id: string) => void;
    addComment: (issueId: string, userId: string, userName: string, userRole: any, text: string) => void;
}

export const useStore = create<IssueState>()(
    persist(
        (set) => ({
            issues: MOCK_ISSUES,
            updates: MOCK_UPDATES,
            comments: MOCK_COMMENTS,
            addIssue: (newIssue) => set((state) => ({
                issues: [
                    {
                        ...newIssue,
                        id: `i${Math.random().toString(36).substr(2, 9)}`,
                        status: 'open',
                        upvotes: 0,
                        reportedAt: new Date().toISOString(),
                    },
                    ...state.issues,
                ]
            })),
            updateIssueStatus: (id, status) => set((state) => ({
                issues: state.issues.map(i => i.id === id ? { ...i, status } : i)
            })),
            upvoteIssue: (id) => set((state) => ({
                issues: state.issues.map(i => i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i)
            })),
            addUpdate: (newUpdate) => set((state) => ({
                updates: [
                    {
                        ...newUpdate,
                        id: `up${Math.random().toString(36).substr(2, 9)}`,
                        likes: 0,
                        date: new Date().toISOString(),
                    },
                    ...state.updates,
                ]
            })),
            likeUpdate: (id) => set((state) => ({
                updates: state.updates.map(u => u.id === id ? { ...u, likes: u.likes + 1 } : u)
            })),
            addComment: (issueId, userId, userName, userRole, text) => set((state) => ({
                comments: [
                    ...state.comments,
                    {
                        id: `c${Math.random().toString(36).substr(2, 9)}`,
                        issueId,
                        userId,
                        userName,
                        userRole,
                        text,
                        createdAt: new Date().toISOString(),
                    }
                ]
            }))
        }),
        {
            name: 'citizen-voice-storage',
        }
    )
);
