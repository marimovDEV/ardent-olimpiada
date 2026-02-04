
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Activity } from "lucide-react";
import FinanceTrendChart from "@/components/admin/bi/FinanceTrendChart";
import TopItemsChart from "@/components/admin/bi/TopItemsChart";
import { useTranslation } from "react-i18next";

interface FinanceDashboardProps {
    stats: {
        total: number;
        today_count: number;
        refunded: number;
    };
    loading: boolean;
}

export default function FinanceDashboard({ stats, loading }: FinanceDashboardProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +12.5%
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-foreground tracking-tight">{stats.total.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground font-medium mt-1">{t('admin.totalRevenue')}</div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-bold">
                            Bugun
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-foreground tracking-tight">{stats.today_count}</div>
                        <div className="text-sm text-muted-foreground font-medium mt-1">{t('admin.todayTransactions', { defaultValue: "Bugungi to'lovlar" })}</div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-full font-bold">
                            Refunds
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-foreground tracking-tight">{stats.refunded.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground font-medium mt-1">{t('admin.refunds')}</div>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid lg:grid-cols-2 gap-6">
                <FinanceTrendChart />
                <TopItemsChart />
            </div>

            {/* Recent Transactions Preview (Optional) */}
            {/* Use reused table component if needed, but keeping it simple for now */}
        </div>
    );
}
