import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Trophy,
    Award,
    Calendar,
    CheckCircle2,
    XCircle,
    ArrowRight,
    TrendingUp,
    Download,
    RotateCcw,
    Zap,
    BarChart3,
    Filter
} from "lucide-react";

// Enhanced Mock Data
const results = [
    {
        id: 1,
        title: "Mantiqiy savollar #42",
        date: "24-oktyabr, 2023",
        score: 95,
        maxScore: 100,
        correct: 19,
        incorrect: 1,
        timeSpent: "14 daqiqa",
        status: "A'lo",
        category: "practice",
        improvement: 6, // +6 points
        ratingImpact: 12, // +12 XP
        topicsStrong: ["Mantiqiy ketma-ketlik", "Grafik tahlil"],
        topicsWeak: [],
        certificate: null
    },
    {
        id: 2,
        title: "IT asoslari kursi testi",
        date: "21-oktyabr, 2023",
        score: 88,
        maxScore: 100,
        correct: 44,
        incorrect: 6,
        timeSpent: "45 daqiqa",
        status: "Yaxshi",
        category: "course",
        improvement: 15,
        ratingImpact: 20,
        topicsStrong: ["Kompyuter qurilmalari", "Tarmoqlar"],
        topicsWeak: ["Xavfsizlik asoslari"],
        certificate: null
    },
    {
        id: 3,
        title: "Matematika Respublika Olimpiadasi",
        date: "15-oktyabr, 2023",
        score: 72,
        maxScore: 100,
        correct: 36,
        incorrect: 14,
        timeSpent: "2 soat 15 daqiqa",
        status: "Yaxshi",
        category: "olympiad",
        improvement: -3,
        ratingImpact: 50,
        topicsStrong: ["Algebra", "Tenglamalar"],
        topicsWeak: ["Geometriya", "Trigonometriya"],
        certificate: "https://example.com/cert.pdf"
    },
    {
        id: 4,
        title: "Ingliz tili Mock Test",
        date: "10-oktyabr, 2023",
        score: 45,
        maxScore: 100,
        correct: 18,
        incorrect: 22,
        timeSpent: "1 soat",
        status: "Qoniqarli",
        category: "practice",
        improvement: 0,
        ratingImpact: 5,
        topicsStrong: ["Reading"],
        topicsWeak: ["Grammar", "Listening"],
        certificate: null
    }
];

const categories = [
    { id: 'all', label: 'Barcha Natijalar' },
    { id: 'olympiad', label: 'Olimpiadalar' },
    { id: 'course', label: 'Kurs Testlari' },
    { id: 'practice', label: 'Mashqlar' }
];

const ResultsPage = () => {
    const [activeTab, setActiveTab] = useState('all');

    const filteredResults = activeTab === 'all'
        ? results
        : results.filter(r => r.category === activeTab);

    // Stats
    const totalTests = results.length;
    const avgScore = Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / totalTests);
    const bestResult = Math.max(...results.map(r => r.score));

    return (
        <div className="p-4 md:p-8 animate-fade-in max-w-5xl mx-auto min-h-screen">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Natijalarim</h1>
                    <p className="text-gray-500">O'z ustingizda ishlash uchun tahlillar</p>
                </div>

                {/* Categories Tab */}
                <div className="bg-gray-100 p-1 rounded-xl flex gap-1 overflow-x-auto max-w-full">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === cat.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-blue-200 font-bold text-xs uppercase">O'rtacha Ball</span>
                        <BarChart3 className="w-5 h-5 text-blue-200" />
                    </div>
                    <span className="text-3xl font-black">{avgScore}%</span>
                </div>
                <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-emerald-100 font-bold text-xs uppercase">Eng yaxshi natija</span>
                        <Trophy className="w-5 h-5 text-emerald-100" />
                    </div>
                    <span className="text-3xl font-black">{bestResult}%</span>
                </div>
                <div className="bg-indigo-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-indigo-200 font-bold text-xs uppercase">Jami Testlar</span>
                        <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                    </div>
                    <span className="text-3xl font-black">{totalTests} ta</span>
                </div>
            </div>

            {/* Results Feed */}
            <div className="space-y-6">
                {filteredResults.map((item) => (
                    <div key={item.id} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col gap-6">

                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                            <div className="flex gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${item.score >= 80 ? 'bg-green-100 text-green-600' : item.score >= 60 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-500'}`}>
                                    {item.score}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                        {item.category === 'olympiad' && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><Trophy className="w-3 h-3" /> Olimpiada</span>}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-3">
                                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span>{item.timeSpent}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                <div className="flex flex-col items-center px-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">To'g'ri</span>
                                    <span className="text-green-600 font-bold">{item.correct}</span>
                                </div>
                                <div className="w-px h-6 bg-gray-200"></div>
                                <div className="flex flex-col items-center px-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Noto'g'ri</span>
                                    <span className="text-red-500 font-bold">{item.incorrect}</span>
                                </div>
                                <div className="w-px h-6 bg-gray-200"></div>
                                <div className="flex flex-col items-center px-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Progress</span>
                                    <span className={`font-bold flex items-center gap-0.5 ${item.improvement >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {item.improvement > 0 ? '+' : ''}{item.improvement}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Analysis & Actions Row */}
                        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">

                            {/* Analysis Summary */}
                            <div className="space-y-3">
                                {item.topicsStrong.length > 0 && (
                                    <div className="flex items-start gap-2 text-sm">
                                        <div className="bg-green-100 p-1 rounded-md mt-0.5"><CheckCircle2 className="w-3 h-3 text-green-600" /></div>
                                        <div>
                                            <span className="font-bold text-gray-700 block text-xs uppercase mb-1">Kuchli tomonlar:</span>
                                            <span className="text-gray-600">{item.topicsStrong.join(", ")}</span>
                                        </div>
                                    </div>
                                )}
                                {item.topicsWeak.length > 0 && (
                                    <div className="flex items-start gap-2 text-sm">
                                        <div className="bg-red-100 p-1 rounded-md mt-0.5"><XCircle className="w-3 h-3 text-red-500" /></div>
                                        <div>
                                            <span className="font-bold text-gray-700 block text-xs uppercase mb-1">Qayta ko'rish kerak:</span>
                                            <span className="text-gray-600">{item.topicsWeak.join(", ")}</span>
                                        </div>
                                    </div>
                                )}
                                {item.ratingImpact > 0 && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-bold text-gray-600">
                                            Reytingga <span className="text-blue-600">+{item.ratingImpact} XP</span> qo'shildi
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-end items-end">
                                {item.certificate && (
                                    <Button variant="outline" className="w-full sm:w-auto border-dashed border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400">
                                        <Download className="w-4 h-4 mr-2" /> Sertifikatni yuklab olish
                                    </Button>
                                )}

                                {item.topicsWeak.length > 0 ? (
                                    <Button className="w-full sm:w-auto bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 shadow-sm">
                                        <RotateCcw className="w-4 h-4 mr-2" /> Xatolarni tahlil qilish
                                    </Button>
                                ) : (
                                    <Button variant="secondary" className="w-full sm:w-auto">
                                        <ArrowRight className="w-4 h-4 mr-2" /> Batafsil tahlil
                                    </Button>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultsPage;
