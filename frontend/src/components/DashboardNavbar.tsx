import { API_URL as API_BASE } from "@/services/api";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bell,
    Search,
    Menu,
    ChevronDown,
    LogOut,
    User as UserIcon,
    Settings,
    Trophy,
    Zap,
    Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArdCoin from './ArdCoin';
import NotificationBell from './NotificationBell';
import PaymentModal from './payment/PaymentModal';
import LevelProgressModal from './dashboard/LevelProgressModal';


interface NavbarProps {
    onMobileMenuClick?: () => void;
}

import { useTranslation } from 'react-i18next';

// ... imports

const DashboardNavbar = ({ onMobileMenuClick }: NavbarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>({});
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

    // Use user data instead of hardcoded mock
    const level = user.level || 1;
    const xp = user.xp || 0;
    const currentLevelProgress = user.level_progress?.xp_current || 0;
    const xpLeft = user.level_progress?.xp_left || 500;
    const progressPercent = user.level_progress?.progress_percent || 0;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Load user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const getRoleLabel = (role: string) => {
        if (role === 'ADMIN') return t('dashboard.navbar.roles.admin');
        if (role === 'TEACHER') return t('dashboard.navbar.roles.teacher');
        return t('dashboard.navbar.roles.student');
    };

    return (
        <header
            className={`sticky top-0 z-30 w-full transition-all duration-500 ${scrolled
                ? 'bg-background/80 backdrop-blur-2xl shadow-xl border-b border-white/5'
                : 'bg-transparent'
                }`}
        >
            <div className="h-20 px-4 md:px-8 flex items-center justify-between gap-4">

                {/* Mobile Menu Toggle (Left on mobile) */}
                <div className="flex lg:hidden flex-1 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMobileMenuClick}
                        className="rounded-xl hover:bg-white/5 text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </div>

                {/* Left Side (Desktop: Search) */}
                <div className="hidden lg:flex items-center gap-6 flex-1">
                    <div className="relative w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-primary transition-all duration-300" />
                        <input
                            type="text"
                            placeholder={t('dashboard.navbar.search')}
                            className="w-full h-11 pl-11 pr-5 rounded-2xl bg-white/5 border border-white/5 focus:bg-white/[0.08] focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm text-text-primary placeholder:text-text-secondary"
                        />
                    </div>
                </div>

                {/* Right Side: Stats & Profile */}
                <div className="flex items-center gap-4 md:gap-6">

                    {/* Level & XP Widget (Students Only) */}
                    {user.role !== 'TEACHER' && (
                        <div
                            className="flex items-center gap-3 bg-background/80 backdrop-blur-md p-1.5 pr-5 rounded-full border border-white/5 hover:border-primary/30 transition-all cursor-pointer group relative active:scale-95 shadow-2xl"
                            onClick={() => setIsProgressModalOpen(true)}
                        >
                            {/* Level Badge */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm shadow-purple group-hover:scale-110 transition-transform duration-500">
                                {level}
                            </div>

                            {/* Stats */}
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black text-text-primary tracking-widest font-cinzel">{xp} XP</span>
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{t('dashboard.navbar.xpLeft', { xp: xpLeft })}</span>
                                </div>
                                <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 group-hover:animate-pulse"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Teacher Subscription Status */}
                    {user.role === 'TEACHER' && (
                        user.teacher_profile?.is_premium ? (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl text-xs font-black tracking-widest shadow-purple">
                                <Crown className="w-4 h-4" />
                                {t('dashboard.navbar.premium')}
                            </div>
                        ) : (
                            <Link to="/teacher/courses/create">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/5 text-white border-white/10 hover:bg-white/10 rounded-xl font-bold border-2"
                                >
                                    <Crown className="w-4 h-4 mr-2 text-primary" />
                                    {t('dashboard.navbar.upgrade')}
                                </Button>
                            </Link>
                        )
                    )}

                    {/* ArdCoin Balance */}
                    <div
                        className="flex items-center gap-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 px-4 py-2 rounded-2xl border border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20 transition-all group shadow-lg"
                        onClick={() => setPaymentOpen(true)}
                    >
                        <ArdCoin amount={parseFloat(user.balance || 0)} className="scale-125 group-hover:rotate-12 transition-transform duration-500" />
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xs font-black text-white leading-none tracking-tighter">{parseFloat(user.balance || 0).toLocaleString()}</span>
                            <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest mt-0.5">Coins</span>
                        </div>
                    </div>

                    <PaymentModal
                        isOpen={paymentOpen}
                        onOpenChange={setPaymentOpen}
                        onSuccess={() => {
                            window.location.reload();
                        }}
                    />

                    {/* Notifications */}
                    <div className="relative group">
                        <NotificationBell />
                    </div>

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all outline-none group border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-br from-primary/40 to-secondary/40 group-hover:from-primary group-hover:to-secondary transition-all duration-500">
                                    <div className="w-full h-full rounded-full bg-[#0B0F1A] border-2 border-[#0B0F1A] overflow-hidden relative shadow-2xl">
                                        {user.avatar_url || user.avatar ? (
                                            <img src={user.avatar_url || user.avatar} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-white font-black text-lg">
                                                {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-left hidden lg:block pr-2">
                                    <p className="text-sm font-black text-text-primary leading-none group-hover:text-primary transition-colors">
                                        {user.first_name || user.username}
                                    </p>
                                    <p className="text-[10px] text-text-secondary mt-1 font-bold uppercase tracking-wider">
                                        {getRoleLabel(user.role)}
                                    </p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-2xl border-white/5 rounded-2xl shadow-2xl p-2">
                            <DropdownMenuLabel className="mb-2">
                                <p className="text-xs text-text-secondary font-black uppercase tracking-widest">{t('dashboard.navbar.myAccount')}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigate('/profile')}
                                className="rounded-xl h-12 gap-3 focus:bg-primary/10 focus:text-primary cursor-pointer transition-all"
                            >
                                <UserIcon className="w-4 h-4" />
                                <span className="font-bold">{t('dashboard.navbar.profile')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/settings')}
                                className="rounded-xl h-12 gap-3 focus:bg-white/5 cursor-pointer transition-all"
                            >
                                <Settings className="w-4 h-4" />
                                <span className="font-bold">{t('dashboard.navbar.settings', 'Sozlamalar')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5 my-2" />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="rounded-xl h-12 gap-3 text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-bold">{t('dashboard.navbar.logout')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>

            <LevelProgressModal
                isOpen={isProgressModalOpen}
                onClose={() => setIsProgressModalOpen(false)}
                user={user}
            />
        </header>
    );
};

export default DashboardNavbar;
