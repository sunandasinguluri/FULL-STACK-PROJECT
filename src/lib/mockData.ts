export type Role = 'citizen' | 'politician' | 'moderator' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    area?: string;
    avatar?: string;
}

export type IssueStatus = 'open' | 'in-progress' | 'resolved';

export interface Issue {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    pincode: string;
    status: IssueStatus;
    reportedBy: string; // User ID
    reportedAt: string;
    upvotes: number;
    images: string[];
}

export interface Comment {
    id: string;
    issueId: string;
    userId: string;
    userName: string;
    userRole: Role;
    text: string;
    createdAt: string;
}

export interface Update {
    id: string;
    politicianId: string;
    politicianName: string;
    title: string;
    content: string;
    image?: string;
    date: string;
    likes: number;
}

export const CATEGORIES = [
    'Roads & Transport',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Health',
    'Education',
    'Environment',
    'Others',
];

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Aditya Kumar',
        email: 'aditya@example.com',
        role: 'citizen',
        area: 'Indiranagar, Bangalore',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
    },
    {
        id: 'u2',
        name: 'Hon. Rajesh Singh',
        email: 'rajesh@gov.in',
        role: 'politician',
        area: 'Central Bangalore',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    },
    {
        id: 'u3',
        name: 'Suresh Raina',
        email: 'suresh@mod.in',
        role: 'moderator',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
    },
];

export const MOCK_ISSUES: Issue[] = [
    {
        id: 'i1',
        title: 'Huge pothole near Indiranagar Metro',
        description: 'There is a very large pothole right after the metro station exit. It is causing traffic jams and is dangerous for two-wheelers.',
        category: 'Roads & Transport',
        location: 'Indiranagar 100ft Rd',
        pincode: '560038',
        status: 'open',
        reportedBy: 'u1',
        reportedAt: '2024-03-20T10:00:00Z',
        upvotes: 45,
        images: ['https://images.unsplash.com/photo-1596450514735-373323091152?w=800&q=80'],
    },
    {
        id: 'i2',
        title: 'No water supply for 3 days',
        description: 'We have not received any water in our colony for the last 3 days. Complaints to BWSSB have gone unanswered.',
        category: 'Water Supply',
        location: 'Defense Colony',
        pincode: '560038',
        status: 'in-progress',
        reportedBy: 'u1',
        reportedAt: '2024-03-18T08:30:00Z',
        upvotes: 82,
        images: [],
    },
    {
        id: 'i3',
        title: 'Street lights not working',
        description: 'The street lights from 12th main to 14th main are all broken. It is very dark at night.',
        category: 'Electricity',
        location: 'Indiranagar',
        pincode: '560008',
        status: 'resolved',
        reportedBy: 'u4',
        reportedAt: '2024-03-15T19:00:00Z',
        upvotes: 23,
        images: [],
    },
];

export const MOCK_UPDATES: Update[] = [
    {
        id: 'up1',
        politicianId: 'u2',
        politicianName: 'Hon. Rajesh Singh',
        title: 'New Park Inauguration',
        content: 'We are happy to announce the opening of a new community park in Indiranagar 5th block. All are welcome!',
        date: '2024-03-22T11:00:00Z',
        likes: 156,
    },
    {
        id: 'up2',
        politicianId: 'u2',
        politicianName: 'Hon. Rajesh Singh',
        title: 'Road Repair Schedule',
        content: 'Road work for the 100ft road pothole will begin tonight at 11 PM. Please expect minor diversions.',
        date: '2024-03-21T15:00:00Z',
        likes: 245,
    },
];

export const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        issueId: 'i1',
        userId: 'u2',
        userName: 'Hon. Rajesh Singh',
        userRole: 'politician',
        text: 'I have taken note of this. The PWD department has been notified.',
        createdAt: '2024-03-20T14:00:00Z',
    },
    {
        id: 'c2',
        issueId: 'i1',
        userId: 'u1',
        userName: 'Aditya Kumar',
        userRole: 'citizen',
        text: 'Thank you for the quick response!',
        createdAt: '2024-03-20T15:30:00Z',
    },
];
