import { Trophy, Star, TrendingUp, Zap } from "lucide-react";

const GamificationStats = () => {
    return (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -ml-6 -mb-6 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
                    <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                    <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-1">Mening darajam</div>
                    <h2 className="text-2xl font-black tracking-tight">Level 7 - Nomzod</h2>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2 flex justify-between text-xs font-bold text-indigo-100">
                <span>2,450 XP</span>
                <span>Keyingi level: 3,000 XP</span>
            </div>
            <div className="h-3 bg-black/20 rounded-full overflow-hidden mb-4 border border-white/5">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-[78%] shadow-[0_0_10px_rgba(251,191,36,0.5)] relative">
                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/10 rounded-xl p-2 flex items-center gap-2 border border-white/5">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="font-bold">Top 5%</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2 flex items-center gap-2 border border-white/5">
                    <Zap className="w-4 h-4 text-blue-300" />
                    <span className="font-bold">7 kun strike</span>
                </div>
            </div>
        </div>
    );
};

export default GamificationStats;
