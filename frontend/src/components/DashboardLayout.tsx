import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    LayoutGrid,
    BookOpen,
    Trophy,
    Award,
    Zap,
    Menu,
    PlayCircle,
    LogOut
} from "lucide-react";
import SupportWidget from '@/components/support/SupportWidget';

const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { path: '/dashboard', label: 'Asosiy', icon: LayoutGrid },
        { path: '/courses', label: 'Barcha Kurslar', icon: BookOpen },
        { path: '/my-courses', label: 'Mening Kurslarim', icon: PlayCircle },
        { path: '/olympiads', label: 'Olimpiadalar', icon: Trophy },
        { path: '/results', label: 'Natijalar', icon: Award },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="p-8 pb-4">
                    <Link to="/" className="flex items-center gap-2 mb-6">
                        <img src="/logo.png" alt="Ardent Logo" className="w-8 h-8 rounded-xl object-contain" />
                        <span className="text-xl font-black text-gray-900 tracking-tight">Ardent</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group relative overflow-hidden ${isActive(item.path)
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${isActive(item.path) ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} />
                            <span className="relative z-10">{item.label}</span>
                            {isActive(item.path) && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3 px-4 rounded-xl h-11">
                        <LogOut className="w-5 h-5" />
                        Chiqish
                    </Button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-[100dvh]">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Ardent Logo" className="w-8 h-8 rounded-lg object-contain" />
                        <span className="font-bold text-gray-900">Ardent</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto w-full relative">
                    <Outlet />
                    {/* Floating Support Widget */}
                    <SupportWidget />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
