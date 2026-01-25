import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Trophy, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
            <span className="text-xl md:text-2xl font-bold gradient-text">
              Ardent
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/all-courses" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Kurslar
            </Link>
            <Link to="/subjects" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Fanlar
            </Link>
            <Link to="/all-olympiads" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Olimpiadalar
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Biz haqimizda
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Kirish
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" size="default">
                Ro'yxatdan o'tish
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link
                to="/all-courses"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-medium">Kurslar</span>
              </Link>
              <Link
                to="/subjects"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 text-secondary" />
                <span className="font-medium">Fanlar</span>
              </Link>
              <Link
                to="/all-olympiads"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Trophy className="w-5 h-5 text-warning" />
                <span className="font-medium">Olimpiadalar</span>
              </Link>
              <div className="flex flex-col gap-2 mt-4 px-4">
                <Button variant="outline" className="w-full">
                  <User className="w-5 h-5" />
                  Kirish
                </Button>
                <Button variant="hero" className="w-full">
                  Ro'yxatdan o'tish
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
