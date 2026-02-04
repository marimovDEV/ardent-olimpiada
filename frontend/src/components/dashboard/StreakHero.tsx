import React, { useState, useEffect } from 'react';
import { Flame, Clock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StreakInfo {
    title: string;
    subtitle: string;
    streak_count: number;
    is_danger: boolean;
    hours_left: number;
    seconds_until_reset?: number;
    is_active_today?: boolean;
}

const StreakHero = ({ data }: { data: StreakInfo }) => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState(data.seconds_until_reset || 0);

    useEffect(() => {
        if (!data.seconds_until_reset) return;

        setTimeLeft(data.seconds_until_reset);

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [data.seconds_until_reset]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isSaved = data.is_active_today;

    return (
        <div className={`relative overflow-hidden rounded-2xl p-1 shadow-lg transition-all duration-500 ${isSaved
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-900/20'
                : 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-900/20'
            }`}>
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>

            <div className="relative bg-black/20 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-white min-h-[140px]">

                {/* Left: Streak Info */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`absolute inset-0 blur-[40px] opacity-60 animate-pulse ${isSaved ? 'bg-emerald-400' : 'bg-red-500'
                            }`}></div>
                        <Flame
                            className={`w-16 h-16 animate-float-slow drop-shadow-lg ${isSaved ? 'text-emerald-300' : 'text-yellow-300'
                                }`}
                            fill="currentColor"
                        />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 blur-sm rounded-full"></div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-black uppercase tracking-tight italic">
                                {data.streak_count} {t('dashboard.streak.daily')} <span className={isSaved ? 'text-emerald-300' : 'text-yellow-300'}>{t('dashboard.streak.streak')}</span>
                            </h2>
                            {isSaved && <CheckCircle2 className="w-6 h-6 text-emerald-300 animate-bounce" />}
                        </div>
                        <p className="text-white/90 font-medium max-w-sm leading-tight mt-1">
                            {t(data.subtitle)}
                        </p>
                    </div>
                </div>

                {/* Right: Timer / Status */}
                <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md transition-all ${isSaved
                            ? 'bg-emerald-400/20 border-emerald-400/30 text-emerald-50'
                            : 'bg-black/30 border-white/10 text-white'
                        }`}>
                        <Clock className={`w-5 h-5 ${!isSaved && data.is_danger ? 'animate-pulse text-red-200' : ''}`} />
                        <div className="flex flex-col">
                            <span className="font-bold font-mono text-2xl tracking-wider">
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-[10px] uppercase font-black tracking-widest opacity-70">
                                {isSaved ? t('dashboard.streak.saved') : t('dashboard.streak.left')}
                            </span>
                        </div>
                    </div>
                    {!isSaved && (
                        <p className="text-[10px] text-white/70 mt-3 uppercase font-black tracking-[0.2em] animate-pulse">
                            {t('dashboard.streak.keepStreak')}
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default StreakHero;
