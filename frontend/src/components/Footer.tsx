import { Link } from "react-router-dom";
import { Facebook, Instagram, Send, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t pt-8 md:pt-16 pb-6 md:pb-8">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16">
          {/* Brand Column */}
          <div className="space-y-3 md:space-y-4">
            <Link to="/" className="flex items-center gap-2 mb-3 md:mb-4">
              <img src="/logo.png" alt="Logo" className="h-6 md:h-8 w-auto mix-blend-multiply dark:mix-blend-normal" onError={(e) => e.currentTarget.style.display = 'none'} />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Ardent
              </span>
            </Link>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
              {t('footer.description')}
            </p>
            <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
              <a href="#" className="bg-muted p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-muted p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="bg-muted p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="bg-muted p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Courses Column */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">{t('footer.courses_title')}</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground">
              <li><Link to="/courses" className="hover:text-primary transition-colors">{t('footer.all_courses')}</Link></li>
              <li><Link to="/courses?cat=programming" className="hover:text-primary transition-colors">{t('footer.programming')}</Link></li>
              <li><Link to="/courses?cat=design" className="hover:text-primary transition-colors">{t('footer.design')}</Link></li>
              <li><Link to="/courses?cat=languages" className="hover:text-primary transition-colors">{t('footer.languages')}</Link></li>
              <li><Link to="/olympiads" className="hover:text-primary transition-colors">{t('footer.olympiads')}</Link></li>
              <li><Link to="/pathways" className="hover:text-primary transition-colors">{t('footer.pathways')}</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">{t('footer.company_title')}</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/teachers" className="hover:text-primary transition-colors">{t('footer.teachers')}</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">{t('footer.careers')}</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">{t('footer.blog')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('footer.contact_link')}</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6">{t('footer.contact_title')}</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  +998 90 123 45 67<br />
                  +998 71 200 00 00
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@olimpiada.uz</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">
                  {t('footer.address')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex gap-4 md:gap-6">
            <Link to="/terms" className="hover:text-primary">{t('footer.terms')}</Link>
            <Link to="/privacy" className="hover:text-primary">{t('footer.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
