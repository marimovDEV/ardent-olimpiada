import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid, BookOpen, Trophy, Award, User } from "lucide-react";

const MobileBottomNav = () => {
    const { t } = useTranslation();

    const navItems = [
        { path: "/dashboard", label: t("nav.home"), icon: LayoutGrid },
        { path: "/courses", label: t("nav.courses"), icon: BookOpen },
        { path: "/olympiads", label: t("nav.olympiads"), icon: Trophy },
        { path: "/results", label: t("nav.ranking"), icon: Award },
        { path: "/profile", label: t("nav.profile"), icon: User },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111827] border-t border-white/10 px-2 pb-safe-offset-1 pt-2 rounded-t-[20px] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-around max-w-md mx-auto h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 ${isActive ? "text-[#7C3AED] scale-110" : "text-[#64748B] hover:text-white/80"
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 transition-transform duration-300" />
                        <span className="text-[10px] font-bold uppercase tracking-tight truncate w-full text-center">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
