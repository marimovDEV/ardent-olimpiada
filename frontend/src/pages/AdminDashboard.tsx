import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Users,
    DollarSign,
    TrendingUp,
    BookOpen,
    Trophy,
    Calendar
} from "lucide-react";
import RevenueChart from "@/components/admin/bi/RevenueChart";
import SmsMonitorCard from "@/components/admin/bi/SmsMonitorCard";
import OlympiadFunnel from "@/components/admin/bi/OlympiadFunnel";
import UserGrowthChart from "@/components/admin/bi/UserGrowthChart";

const AdminDashboard = () => {
    // Mock Top-Level Stats
    const stats = [
        { label: "Jami foydalanuvchilar", value: "1,245", change: "+12%", icon: Users, color: "text-primary" },
        { label: "Oylik daromad", value: "12,500,000", change: "+8%", icon: DollarSign, color: "text-success", suffix: "so'm" },
        { label: "Faol kurslar", value: "24", change: "+2", icon: BookOpen, color: "text-warning" },
        { label: "Olimpiada ishtirokchilari", value: "847", change: "+25%", icon: Trophy, color: "text-accent" },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">BI Tahlil Paneli</h1>
                    <p className="text-gray-500">Real vaqt rejimida biznes ko'rsatkichlari</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10">
                        <Calendar className="w-4 h-4 mr-2" />
                        Jan 2024
                    </Button>
                    <Button variant="hero" className="h-10">
                        Hisobot Yuklash (PDF)
                    </Button>
                </div>
            </header>

            {/* Top Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="flex items-center text-xs font-bold bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {stat.change}
                            </span>
                        </div>
                        <div className="text-3xl font-black mb-1 tracking-tight text-gray-900">
                            {stat.value} <span className="text-sm font-normal text-gray-400">{stat.suffix}</span>
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* BI GRID LAYOUT */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* User Growth */}
                    <UserGrowthChart />

                    {/* Olympiad Funnel (Quality Control) */}
                    <div className="h-[400px]">
                        <OlympiadFunnel />
                    </div>
                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-6">
                    {/* Revenue Breakdown */}
                    <div className="h-[400px]">
                        <RevenueChart />
                    </div>

                    {/* SMS Monitor (Critical) */}
                    <SmsMonitorCard />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
