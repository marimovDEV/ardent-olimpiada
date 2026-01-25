import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const stats = [
    {
        subject: "Mantiq",
        score: "85%",
        trend: 12, // positive
        status: "kuchli"
    },
    {
        subject: "Matematika",
        score: "72%",
        trend: 5,
        status: "normal"
    },
    {
        subject: "Informatika",
        score: "45%",
        trend: -4,
        status: "zaif"
    }
];

const AnalyticsResults = () => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Mening Natijalarim</h2>

            <div className="grid sm:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.subject} className="bg-gray-50 rounded-2xl p-4 relative group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                        {stat.status === 'kuchli' && (
                            <span className="absolute -top-2 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                Kuchli tomoningiz
                            </span>
                        )}

                        <div className="text-gray-500 text-sm font-medium mb-1">{stat.subject}</div>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-black text-gray-900">{stat.score}</span>
                            <div className={`flex items-center text-xs font-bold mb-1.5 ${stat.trend > 0 ? 'text-green-600' : stat.trend < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                {stat.trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : stat.trend < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                                {stat.trend > 0 ? '+' : ''}{stat.trend}%
                            </div>
                        </div>

                        {/* Mini Chart visualization */}
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-0.5">
                            <div className={`h-full rounded-full ${stat.status === 'kuchli' ? 'bg-green-500' : stat.status === 'zaif' ? 'bg-red-400' : 'bg-blue-400'}`} style={{ width: stat.score }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsResults;
