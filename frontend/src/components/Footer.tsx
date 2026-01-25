import { Trophy, Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold gradient-text">Ardent</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Maktab o'quvchilari uchun online ta'lim va olimpiada platformasi
            </p>
            <div className="flex gap-3">
              <Link to="/" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Send className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Sahifalar</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Bosh sahifa</Link></li>
              <li><Link to="/all-courses" className="text-muted-foreground hover:text-primary transition-colors">Kurslar</Link></li>
              <li><Link to="/all-olympiads" className="text-muted-foreground hover:text-primary transition-colors">Olimpiadalar</Link></li>
              <li><Link to="/winners" className="text-muted-foreground hover:text-primary transition-colors">G'oliblar</Link></li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-bold mb-4">Fanlar</h4>
            <ul className="space-y-3">
              <li><Link to="/all-courses" className="text-muted-foreground hover:text-primary transition-colors">Matematika</Link></li>
              <li><Link to="/all-courses" className="text-muted-foreground hover:text-primary transition-colors">Fizika</Link></li>
              <li><Link to="/all-courses" className="text-muted-foreground hover:text-primary transition-colors">Informatika</Link></li>
              <li><Link to="/all-courses" className="text-muted-foreground hover:text-primary transition-colors">Mantiq</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Bog'lanish</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +998 90 123 45 67
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                info@olimpiada.uz
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                Toshkent shahri, O'zbekiston
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2025 Olimpiada Platformasi. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Maxfiylik siyosati</Link>
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Foydalanish shartlari</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
