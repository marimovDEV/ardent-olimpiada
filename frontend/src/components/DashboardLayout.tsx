import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    LayoutGrid,
    BookOpen,
    Trophy,
    Award,
    Zap,
    Menu,
    PlayCircle,
    LogOut,
    Moon,
    Sun,
    Globe,
    FileCheck
} from "lucide-react";
import SupportWidget from '@/components/support/SupportWidget';
import DashboardNavbar from "./DashboardNavbar";
import TelegramBotBanner from "./dashboard/TelegramBotBanner";
import MobileBottomNav from "./dashboard/MobileBottomNav";
import { useTranslation } from "react-i18next";

const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Strict Role Check for Student Dashboard
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/auth/login');
            return;
        }
        try {
            const user = JSON.parse(userStr);
            if (user.role === 'TEACHER') {
                navigate('/teacher/dashboard');
            } else if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (user.role !== 'STUDENT') {
                // If unknown role, go to login
                navigate('/auth/login');
            }
        } catch (e) {
            navigate('/auth/login');
        }
    }, [navigate]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path: string) => location.pathname === path;

    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'uz' ? 'ru' : 'uz';
        i18n.changeLanguage(newLang);
    };

    const menuItems = [
        { path: '/dashboard', label: t('dashboard.menu.home'), icon: LayoutGrid },
        { path: '/courses', label: t('dashboard.menu.allCourses'), icon: BookOpen },
        { path: '/my-courses', label: t('dashboard.menu.myCourses'), icon: PlayCircle },
        { path: '/olympiads', label: t('dashboard.menu.olympiads'), icon: Trophy },
        { path: '/results', label: t('dashboard.menu.results'), icon: Award },
        { path: '/my-certificates', label: 'Sertifikatlarim', icon: FileCheck },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
    };

    return (
        <div className="min-h-screen bg-muted/40 flex">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card/60 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="p-8 pb-4">
                    <Link to="/" className="flex items-center gap-3 mb-8 group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-0.5 shadow-gold group-hover:scale-110 transition-transform duration-500">
                            <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center overflow-hidden">
                                <img src="/logo.jpg" alt="Logo" className="w-7 h-7 object-contain" />
                            </div>
                        </div>
                        <span className="text-2xl font-black font-cinzel text-foreground tracking-tighter group-hover:text-primary transition-colors">HOGWORDS</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold group relative overflow-hidden ${isActive(item.path)
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary group-hover:scale-110"}`} />
                            <span className="relative z-10 text-sm tracking-wide">{item.label}</span>
                            {isActive(item.path) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 justify-center gap-2 rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
                            onClick={toggleLanguage}
                        >
                            <Globe className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold uppercase">{i18n.language === 'uz' ? 'UZ' : 'RU'}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-red-400 hover:bg-red-500/5 gap-3 px-5 rounded-2xl h-12 font-bold transition-all"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        {t('dashboard.menu.logout')}
                    </Button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-[100dvh]">

                {/* Fixed Premium Navbar */}
                <DashboardNavbar onMobileMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Telegram Bot Connection Prompt */}
                <TelegramBotBanner />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto w-full relative pb-24 lg:pb-0">
                    <Outlet />
                    {/* Floating Support Widget */}
                    <SupportWidget />
                </main>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
            </div>
        </div>
    );
};

export default DashboardLayout;
