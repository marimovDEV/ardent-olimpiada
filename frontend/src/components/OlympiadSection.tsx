import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Clock, ArrowRight, Star, Timer, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL, getBaseUrl, getImageUrl } from "@/services/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

const CountdownTimer = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 14, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 md:flex items-center justify-center gap-4 md:gap-3 mt-4 max-w-[320px] md:max-w-none mx-auto">
      {['days', 'hours', 'minutes', 'seconds'].map((unit, idx) => (
        <div key={unit} className="flex flex-col items-center p-3 md:p-0 bg-white/[0.03] md:bg-transparent border border-white/5 md:border-none rounded-2xl md:rounded-none">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm">
            <span className="text-2xl md:text-3xl font-black text-primary">
              {timeLeft[unit as keyof typeof timeLeft].toString().padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B] mt-2">
            {t(`olympiadsSection.${unit}`, unit)}
          </span>
        </div>
      ))}
    </div>
  );
};

import { memo } from "react";

const OlympiadCard = memo(({ olympiad, t }: { olympiad: any; t: any }) => {
  return (
    <div className="group relative h-full bg-[#111827] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl flex flex-col">
      {/* Featured Badge */}
      <div className="absolute top-6 right-6 z-20">
        <Badge className="bg-primary text-background font-black px-4 py-1.5 rounded-full shadow-lg">
          {olympiad.featured ? "PREMIUM" : "HOT"}
        </Badge>
      </div>

      {/* Media Area */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={getImageUrl(olympiad.thumbnail)}
          alt={olympiad.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent" />
      </div>

      {/* Details */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-black uppercase tracking-widest px-3">
            {olympiad.subject}
          </Badge>
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-cinzel">
            {olympiad.level}
          </span>
        </div>

        <h3 className="text-xl font-black text-white leading-tight font-cinzel mb-6 line-clamp-2 min-h-[3rem]">
          {olympiad.title}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-secondary">
            <Calendar className="w-4 h-4 text-primary" /> {olympiad.date}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-secondary">
            <Users className="w-4 h-4 text-primary" /> {olympiad.participants}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="text-xl font-black text-white">
            {olympiad.price} <span className="text-xs text-primary">{t('olympiadsSection.currency')}</span>
          </div>

          <Link to={olympiad.is_registered ? `/olympiad/${olympiad.id}` : "/auth"} className="flex-1">
            <Button className="w-full h-12 rounded-xl bg-primary text-background font-black shadow-lg hover:bg-yellow-500 transition-all active:scale-95">
              Qatnashish
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});

const OlympiadSection = () => {
  const { t, i18n } = useTranslation();
  const [upcomingOlympiads, setUpcomingOlympiads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOlympiads = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/olympiads/upcoming/`);
        if (response.data.success) {
          const langCode = i18n.language === 'uz' ? 'uz' : 'ru';
          const mapped = response.data.olympiads.map((item: any) => {
            const startDate = new Date(item.start_date);
            return {
              id: item.id,
              title: item.title,
              subject: item.subject,
              date: startDate.toLocaleDateString(langCode),
              time: startDate.toLocaleTimeString(langCode, { hour: '2-digit', minute: '2-digit' }),
              duration: `${item.duration} min`,
              participants: item.participants_count || 0,
              maxParticipants: item.max_participants || 1000,
              price: item.price === "0.00" || item.price === 0 ? t('common.free') : parseFloat(item.price).toLocaleString(),
              level: item.status_display,
              is_registered: item.is_registered,
              is_completed: item.is_completed,
              featured: item.participants_count > 500,
              thumbnail: item.thumbnail
            };
          });
          setUpcomingOlympiads(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch upcoming olympiads:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOlympiads();
  }, [i18n.language]);

  if (!isLoading && upcomingOlympiads.length === 0) return null;

  return (
    <section id="olympiad" className="py-24 relative bg-[#0B0F1A] overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Urgency Section */}
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-[10px]"
          >
            Keyingi Respublika Olimpiadasiga:
          </motion.div>
          <CountdownTimer />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white font-cinzel pt-6"
          >
            Nufuzli <span className="text-primary italic">Olimpiadalar</span>
          </motion.h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            className="w-full"
          >
            <CarouselContent className="-ml-6 pb-12">
              {upcomingOlympiads.map((olympiad) => (
                <CarouselItem key={olympiad.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <OlympiadCard olympiad={olympiad} t={t} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-center gap-4">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-primary hover:text-background" />
              <CarouselNext className="static translate-y-0 h-12 w-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-primary hover:text-background" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default OlympiadSection;
