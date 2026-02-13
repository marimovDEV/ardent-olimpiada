import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  BookOpen,
  Trophy,
  User,
  Languages,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!token && !!user;

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);

    // If user is logged in, sync to profile
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { default: authService } = await import("@/services/authService");
        await authService.updateProfile({ language: lng });

        // Update local storage user object if exists
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.language = lng;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to sync language to profile:", error);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              // Try multiple scrolling methods
              window.scrollTo({ top: 0, behavior: 'smooth' });
              document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
              document.body.scrollTo({ top: 0, behavior: 'smooth' });

              if (window.location.pathname !== '/') {
                window.location.href = '/';
              }
            }}
          >
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <span className="text-xl md:text-2xl font-black font-cinzel tracking-wider text-primary">
              HOGWORDS
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-wider font-cinzel">
              {t('nav.home', 'Bosh sahifa')}
            </Link>
            <Link to="/olympiads" className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-wider font-cinzel">
              {t('nav.olympiads', 'Olimpiadalar')}
            </Link>
            <Link to="/results" className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-wider font-cinzel">
              {t('nav.ranking', 'Reyting')}
            </Link>
            <Link to="/courses" className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-wider font-cinzel">
              {t('nav.tasks', 'Topshiriqlar')}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('uz')}>
                  <span className="mr-2">🇺🇿</span> O'zbekcha
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ru')}>
                  <span className="mr-2">🇷🇺</span> Русский
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    {t('nav.dashboard', 'Dashboard')}
                  </Button>
                </Link>
                <Link to="/profile">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold border-2 border-background shadow-sm overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="hero" size="default">
                    {t('nav.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button with Sheet */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <div className="flex items-center gap-2">
                    <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-black font-cinzel tracking-wider text-primary">Hogwords</span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 mt-6">
                <Link
                  to="/all-courses"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-medium">{t('nav.courses')}</span>
                </Link>
                <Link
                  to="/guide"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{t('nav.guide')}</span>
                </Link>
                <Link
                  to="/all-olympiads"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Trophy className="w-5 h-5 text-warning" />
                  <span className="font-medium">{t('nav.olympiads')}</span>
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{t('nav.about')}</span>
                </Link>
              </nav>

              {/* Language & Theme */}
              <div className="flex items-center justify-between px-4 py-4 mt-4 border-t border-border">
                <div className="flex gap-2">
                  <Button
                    variant={i18n.language === 'uz' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changeLanguage('uz')}
                    className="min-h-10"
                  >
                    🇺🇿 UZ
                  </Button>
                  <Button
                    variant={i18n.language === 'ru' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changeLanguage('ru')}
                    className="min-h-10"
                  >
                    🇷🇺 RU
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full min-h-10 min-w-10">
                  <Sun className="h-5 w-5 dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:block" />
                </Button>
              </div>

              {/* Auth Buttons */}
              <div className="flex flex-col gap-3 mt-4 px-4">
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" className="w-full min-h-12">
                        <User className="w-5 h-5 mr-2" />
                        {t('nav.dashboard', 'Dashboard')}
                      </Button>
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full min-h-12">
                        {t('nav.profile', 'Profil')}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full min-h-12">
                        <User className="w-5 h-5 mr-2" />
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" className="w-full min-h-12">
                        {t('nav.register')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
