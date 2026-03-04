import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { RootLayout } from './components/layout/RootLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CitizenDashboard from './pages/citizen/Dashboard';
import PoliticianDashboard from './pages/politician/Dashboard';
import PoliticianIssues from './pages/politician/Issues';
import PostUpdatePage from './pages/politician/PostUpdate';
import ReportIssuePage from './pages/citizen/ReportIssue';
import MyIssuesPage from './pages/citizen/MyIssues';
import UpdatesPage from './pages/UpdatesPage';
import FeedbackPage from './pages/citizen/Feedback';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'dashboard/citizen',
        element: <ProtectedRoute allowedRoles={['citizen']}><CitizenDashboard /></ProtectedRoute>,
      },
      {
        path: 'dashboard/politician',
        element: <ProtectedRoute allowedRoles={['politician']}><PoliticianDashboard /></ProtectedRoute>,
      },
      {
        path: 'dashboard/politician/issues',
        element: <ProtectedRoute allowedRoles={['politician']}><PoliticianIssues /></ProtectedRoute>,
      },
      {
        path: 'updates/new',
        element: <ProtectedRoute allowedRoles={['politician']}><PostUpdatePage /></ProtectedRoute>,
      },
      {
        path: 'report',
        element: <ProtectedRoute allowedRoles={['citizen']}><ReportIssuePage /></ProtectedRoute>,
      },
      {
        path: 'issues',
        element: <ProtectedRoute allowedRoles={['citizen']}><MyIssuesPage /></ProtectedRoute>,
      },
      {
        path: 'updates',
        element: <UpdatesPage />,
      },
      {
        path: 'feedback',
        element: <ProtectedRoute allowedRoles={['citizen']}><FeedbackPage /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
