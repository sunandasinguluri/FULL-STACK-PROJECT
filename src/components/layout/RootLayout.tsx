import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

// We need to add Sheet component if not added. I'll add it in the next step or manually create a simple one if needed.
// Actually shadcn/ui sheet is useful here.

export function RootLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
            <div className="flex-1 items-start md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
                <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                    <Sidebar />
                </aside>

                {/* Mobile Sidebar */}
                {/* Assuming Sheet is added or I'll add it. For now I'll just use a simple div if sheet fails */}
                <div className={isMobileMenuOpen ? "fixed inset-0 z-50 bg-background md:hidden" : "hidden"}>
                    <div className="flex h-16 items-center px-6 border-b">
                        <span className="font-bold text-lg">Menu</span>
                        <button className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>Close</button>
                    </div>
                    <Sidebar className="px-2" onClose={() => setIsMobileMenuOpen(false)} />
                </div>

                <main className="flex w-full flex-col overflow-hidden p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
