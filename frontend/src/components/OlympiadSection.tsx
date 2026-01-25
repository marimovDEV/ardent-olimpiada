import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, Clock, ArrowRight, Star, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const upcomingOlympiads = [
  {
    id: 1,
    title: "Matematika Respublika Olimpiadasi",
    subject: "Matematika",
    date: "20-yanvar, 2025",
    time: "10:00",
    duration: "3 soat",
    participants: 847,
    maxParticipants: 1000,
    price: "50,000",
    level: "Pro",
    featured: true,
  },
  {
    id: 2,
    title: "Fizika Challenge",
    subject: "Fizika",
    date: "25-yanvar, 2025",
    time: "14:00",
    duration: "2 soat",
    participants: 342,
    maxParticipants: 500,
    price: "35,000",
    level: "Intermediate",
    featured: false,
  },
  {
    id: 3,
    title: "Informatika Hackathon",
    subject: "Informatika",
    date: "1-fevral, 2025",
    time: "09:00",
    duration: "4 soat",
    participants: 521,
    maxParticipants: 600,
    price: "75,000",
    level: "Olympiad",
    featured: false,
  },
];

const CountdownTimer = () => {
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
        <span className="text-xs uppercase opacity-70">Kun</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.hours}</span>
        <span className="text-xs uppercase opacity-70">Soat</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.minutes}</span>
        <span className="text-xs uppercase opacity-70">Daq</span>
      </div>
      <span className="text-xl font-bold">:</span>
      <div className="flex flex-col items-center bg-white/10 rounded-lg p-2 min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.seconds}</span>
        <span className="text-xs uppercase opacity-70">Son</span>
      </div>
    </div>
  );
};

const OlympiadSection = () => {
  return (
    <section id="olympiad" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="animate-slide-up">
            <span className="inline-block px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
              Olimpiadalar
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Yaqinlashayotgan <span className="bg-clip-text text-transparent bg-gradient-to-r from-warning via-orange-500 to-warning animate-gradient-xy bg-[length:200%_auto]">olimpiadalar</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Eng yaxshi olimpiadalarni o'tkazib yubormang! Ro'yxatdan o'ting va g'olib bo'ling
            </p>
          </div>
          <Link to="/all-olympiads">
            <Button variant="outline" size="lg" className="self-start md:self-auto">
              Barcha olimpiadalar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Olympiad Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {upcomingOlympiads.map((olympiad, index) => (
            <div
              key={olympiad.id}
              className={`group relative bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-strong transition-all duration-300 hover:-translate-y-1 animate-scale-in ${olympiad.featured ? 'ring-2 ring-warning' : ''
                }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Featured badge */}
              {olympiad.featured && (
                <div className="absolute top-4 right-4 z-10 animate-pulse-soft">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-warning text-warning-foreground text-xs font-bold shadow-lg shadow-warning/20">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`p-6 ${olympiad.featured ? 'gradient-accent' : 'gradient-primary'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-white/80 text-sm">{olympiad.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
                        {olympiad.level}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{olympiad.title}</h3>

                {/* Countdown for featured olympiad */}
                {olympiad.featured && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="text-white/80 text-xs mb-2 flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      Boshlanishiga qoldi:
                    </div>
                    <div className="text-white">
                      <CountdownTimer />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{olympiad.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{olympiad.time} • {olympiad.duration}</span>
                  </div>
                </div>

                {/* Participants progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Ishtirokchilar</span>
                    </div>
                    <span className="font-bold text-primary">
                      {olympiad.participants}/{olympiad.maxParticipants}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${(olympiad.participants / olympiad.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Narxi</span>
                    <div className="text-xl font-bold text-foreground">
                      {olympiad.price} <span className="text-sm font-normal">so'm</span>
                    </div>
                  </div>
                  <Link to="/auth">
                    <Button variant={olympiad.featured ? "hero" : "default"} size="lg">
                      Qatnashish
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OlympiadSection;
