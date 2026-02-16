import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Clock, ArrowRight, Star, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "@/services/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CountdownTimer = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 45, seconds: 30 });

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
    <div className="flex items-center gap-2 mt-2">
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.days}</span>
        <span className="text-xs uppercase opacity-70">{t('olympiadsSection.days')}</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.hours}</span>
        <span className="text-xs uppercase opacity-70">{t('olympiadsSection.hours')}</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.minutes}</span>
        <span className="text-xs uppercase opacity-70">{t('olympiadsSection.minutes')}</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.seconds}</span>
        <span className="text-xs uppercase opacity-70">{t('olympiadsSection.seconds')}</span>
      </div>
    </div>
  );
};

import { memo } from "react";

const OlympiadCard = memo(({ olympiad, t }: { olympiad: any; t: any }) => {
  return (
    <div className="group relative h-full bg-[#111827] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 gold-glow-hover flex flex-col">
      {/* Featured Badge */}
      {olympiad.featured && (
        <div className="absolute top-6 right-6 z-20">
          <Badge className="bg-primary text-background font-black px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 animate-pulse-soft">
            <Star className="w-3 h-3 mr-2 fill-background" />
            PREMIUM
          </Badge>
        </div>
      )}

      {/* Media Area */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={olympiad.thumbnail?.startsWith('http') ? olympiad.thumbnail : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${olympiad.thumbnail}`}
          alt={olympiad.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent" />

        {/* Subject & Level Overlay */}
        <div className="absolute bottom-6 left-8 right-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-black uppercase tracking-widest px-3">
              {olympiad.subject}
            </Badge>
            <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">
              {olympiad.level}
            </div>
          </div>
          <h3 className="text-2xl font-black text-white leading-tight font-cinzel line-clamp-2">
            {olympiad.title}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Sana
            </div>
            <div className="text-sm font-black text-white">{olympiad.date}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Vaqt
            </div>
            <div className="text-sm font-black text-white">{olympiad.time}</div>
          </div>
        </div>

        {/* Participation Bar */}
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Ishtirokchilar</span>
            <span className="text-sm font-black text-primary">{olympiad.participants}/{olympiad.maxParticipants}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(olympiad.participants / olympiad.maxParticipants) * 100}%` }}
              className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-secondary uppercase tracking-widest">Narxi</div>
            <div className="text-xl font-black text-white">{olympiad.price} <span className="text-xs text-primary">{t('olympiadsSection.currency')}</span></div>
          </div>

          <Link to={olympiad.is_registered ? `/olympiad/${olympiad.id}` : "/auth"} className="flex-1">
            <Button className="w-full h-14 rounded-2xl bg-primary text-background font-black shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all group/btn">
              {olympiad.is_registered ? "Kirish" : "Qatnashish"}
              <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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

  // Translation helper remains the same (simplified for brevity)
  const tr = (text: string) => text;

  useEffect(() => {
    const fetchOlympiads = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/olympiads/upcoming/`);
        if (response.data.success) {
          const langCode = i18n.language === 'uz' ? 'uz-UZ' : 'ru-RU';
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
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 mb-20">
          <div className="space-y-6 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="px-6 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 backdrop-blur-sm font-black uppercase tracking-widest">
                <Trophy className="w-4 h-4 mr-2" />
                OLYMPIAD LUXURY SHOWCASE
              </Badge>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-white font-cinzel leading-none tracking-tighter">
              Nufuzli <span className="text-primary italic gold-glow">Olimpiadalar</span>
            </h2>
            <p className="text-xl text-secondary font-medium italic">
              O'z mahoratingizni nufuzli olimpiadalarda sinab ko'ring va xalqaro miqyosdagi sertifikatlarga ega bo'ling.
            </p>
          </div>
          <Link to="/all-olympiads" className="shrink-0">
            <Button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-primary hover:text-background transition-all hover:scale-105 shadow-xl">
              Barcha olimpiadalar
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
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
            <CarouselContent className="-ml-8 pb-12">
              {upcomingOlympiads.map((olympiad) => (
                <CarouselItem key={olympiad.id} className="pl-8 md:basis-1/2 lg:basis-1/3">
                  <OlympiadCard olympiad={olympiad} t={t} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-primary hover:text-background" />
              <CarouselNext className="static translate-y-0 h-12 w-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-primary hover:text-background" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
};



{/* Olympiad Carousel */ }
<Carousel
  opts={{
    align: "start",
    loop: true,
  }}
  plugins={[
    Autoplay({
      delay: 3000,
      stopOnMouseEnter: true,
      stopOnInteraction: false,
    }),
  ]}
  className="w-full"
>
  <CarouselContent className="-ml-6 pb-4">
    {upcomingOlympiads.map((olympiad) => (
      <CarouselItem key={olympiad.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
        <OlympiadCard olympiad={olympiad} t={t} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <div className="flex justify-end gap-2 mt-4">
    <CarouselPrevious className="static translate-y-0" />
    <CarouselNext className="static translate-y-0" />
  </div>
</Carousel>
      </div >
    </section >
  );
};

export default OlympiadSection;
