import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    Users,
    DollarSign,
    BookOpen,
    Trophy,
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    Headphones,
    Award
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminLayout = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const NavItems = () => (
        <nav className="space-y-1">
            <Link to="/admin/dashboard">
                <Button variant="ghost" className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${isActive("/admin/dashboard") ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary hover:text-white" : "text-muted-foreground hover:bg-muted"}`}>
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </Button>
            </Link>
            <Link to="/admin/users">
                <Button variant="ghost" className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${isActive("/admin/users") ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary hover:text-white" : "text-muted-foreground hover:bg-muted"}`}>
                    <Users className="w-5 h-5" />
                    Foydalanuvchilar
                </Button>
            </Link>
            <Link to="/admin/courses">
                <Button variant="ghost" className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${isActive("/admin/courses") ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary hover:text-white" : "text-muted-foreground hover:bg-muted"}`}>
                    <BookOpen className="w-5 h-5" />
                    Kurslar
                </Button>
            </Link>
            <Link to="/admin/olympiads">
                <Button variant="ghost" className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${isActive("/admin/olympiads") ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary hover:text-white" : "text-muted-foreground hover:bg-muted"}`}>
                    <Trophy className="w-5 h-5" />
                    Olimpiadalar
                </Button>
            </Link>
            <Link to="/admin/finance">
                <Button variant="ghost" className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${isActive("/admin/finance") ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary hover:text-white" : "text-muted-foreground hover:bg-muted"}`}>
                    <DollarSign className="w-5 h-5" />
                    Moliya
                </Button>
            </Link>
            <Link to="/admin/support">
                <Button variant="ghost" className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${isActive("/admin/support") ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary hover:text-white" : "text-muted-foreground hover:bg-muted"}`}>
                    <Headphones className="w-5 h-5" />
                    Yordam
                </Button>
            </Link>
            <Link to="/admin/certificates">
                <Button variant="ghost" className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${isActive("/admin/certificates") ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary hover:text-white" : "text-muted-foreground hover:bg-muted"}`}>
                    <Award className="w-5 h-5" />
                    Sertifikatlar
                </Button>
            </Link>
            <Link to="/admin/settings">
                <Button variant="ghost" className={`w-full justify-start gap-3 h-12 rounded-xl text-base font-medium transition-all duration-200 ${isActive("/admin/settings") ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary hover:text-white" : "text-muted-foreground hover:bg-muted"}`}>
                    <Settings className="w-5 h-5" />
                    Sozlamalar
                </Button>
            </Link>
        </nav>
    );

    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden lg:block sticky top-0 h-screen overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <img src="/logo.png" alt="Admin Logo" className="w-8 h-8 rounded-lg object-contain" />
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>

                    <NavItems />
                </div>
                <div className="p-6 border-t border-border mt-auto">
                    <Link to="/auth">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="w-4 h-4" />
                            Chiqish
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 border-b border-border bg-card flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Admin Logo" className="w-8 h-8 rounded-lg object-contain" />
                        <span className="font-bold">Admin Panel</span>
                    </div>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-8">
                                    <img src="/logo.png" alt="Admin Logo" className="w-8 h-8 rounded-lg object-contain" />
                                    <span className="font-bold text-lg">Admin Panel</span>
                                </div>
                                <NavItems />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
