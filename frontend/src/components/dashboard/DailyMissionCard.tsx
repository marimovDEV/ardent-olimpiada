import { Play, Sparkles, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translateBackendText } from '@/utils/backendTranslations';

interface Mission {
    type: string;
    title: string;
    subtitle: string;
    duration: string;
    xp_reward: number;
    link: string;
    is_completed?: boolean;
    is_streak_saved?: boolean;
}

const DailyMissionCard = ({ mission }: { mission: Mission }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isDone = mission.is_completed;

    const handleAction = () => {
        if (!isDone && mission.link) {
            navigate(mission.link);
        }
    };

    return (
        <div className="relative group h-full">
            {/* Pulsing Border */}
            <div className={`absolute -inset-1 rounded-2xl opacity-75 blur-lg group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 animate-pulse-soft ${isDone ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
                }`}></div>

            <div className="relative bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center space-y-4 shadow-2xl overflow-hidden h-full">

                {/* Background Decoration */}
                <div className={`absolute inset-0 opacity-10 ${isDone ? 'bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.3),transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.2),transparent_70%)]'
                    }`}></div>

                {/* Header */}
                <div className="space-y-1 relative z-10">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${isDone
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-purple-500/20 border-purple-500/30 text-purple-300 animate-bounce'
                        }`}>
                        {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        {isDone
                            ? t('dashboard.mission.completed')
                            : (mission.is_streak_saved ? t('dashboard.mission.next') : t('dashboard.mission.today'))}
                    </div>
                    <h3 className="text-2xl font-black text-foreground leading-tight">
                        {mission.type === 'GENERIC' ? t(mission.title) : translateBackendText(mission.title)}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">
                        {mission.type === 'GENERIC' ? t(mission.subtitle) : translateBackendText(mission.subtitle)}
                    </p>
                </div>

                {/* Details */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-bold text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border w-full justify-center relative z-10">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-400" />
                        {mission.duration}
                    </div>
                    <div className="w-px h-4 bg-muted hidden sm:block"></div>
                    <div className="flex items-center gap-1.5 text-yellow-400">
                        <Zap className={`w-4 h-4 ${isDone ? 'text-emerald-400 fill-emerald-400' : 'fill-yellow-400'}`} />
                        +{mission.xp_reward} XP
                    </div>
                </div>

                {/* Action Button */}
                <div className="w-full relative z-20">
                    <Button
                        onClick={handleAction}
                        disabled={isDone}
                        className={`w-full h-12 sm:h-14 font-bold text-base rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${isDone
                            ? 'bg-emerald-600/50 text-emerald-100 cursor-default shadow-none'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/30'
                            }`}>
                        {isDone ? (
                            <><CheckCircle2 className="w-5 h-5 mr-2" /> {t('dashboard.mission.finished')}</>
                        ) : (
                            <><Play className="w-5 h-5 mr-2 fill-white" /> {t('dashboard.mission.start')}</>
                        )}
                    </Button>
                </div>

                <p className={`text-[10px] sm:text-xs text-center font-medium relative z-10 ${isDone ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                    {isDone
                        ? t('dashboard.mission.success_msg')
                        : (mission.is_streak_saved ? t('dashboard.streak.saved_msg') : t('dashboard.mission.warning'))}
                </p>
            </div>
        </div>
    );
};

export default DailyMissionCard;
