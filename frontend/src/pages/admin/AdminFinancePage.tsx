// Force update

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Receipt, Settings, Smartphone } from "lucide-react";
import FinanceDashboard from "./finance/FinanceDashboard";
import FinanceTransactions from "./finance/FinanceTransactions";
import FinanceSettings from "./finance/FinanceSettings";
import AdminBotPayments from "./settings/AdminBotPayments"; // Reuse existing
import { getAuthHeader } from "@/services/api";
import { API_URL } from "@/services/api";
import axios from "axios";

export default function AdminFinancePage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState({ total: 0, today_count: 0, refunded: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/stats/`, { headers: getAuthHeader() });
            if (res.data.success) {
                setStats({
                    total: res.data.stats.finance?.total_revenue || 0,
                    today_count: res.data.stats.finance?.today_count || 0,
                    refunded: res.data.stats.finance?.refunded_amount || 0
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight">Moliya</h1>
                <p className="text-muted-foreground">To'lovlar statistikasi, tranzaksiyalar va sozlamalar.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                <div className="border-b">
                    <TabsList className="bg-transparent p-0 h-auto gap-6">
                        <TabsTrigger
                            value="dashboard"
                            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 bg-transparent border-b-2 border-transparent transition-all"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Statistika
                        </TabsTrigger>
                        <TabsTrigger
                            value="transactions"
                            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 bg-transparent border-b-2 border-transparent transition-all"
                        >
                            <Receipt className="w-4 h-4 mr-2" />
                            Tranzaksiyalar
                        </TabsTrigger>
                        <TabsTrigger
                            value="bot_verification"
                            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 bg-transparent border-b-2 border-transparent transition-all"
                        >
                            <Smartphone className="w-4 h-4 mr-2" />
                            Bot To'lovlari (Tasdiqlash)
                        </TabsTrigger>
                        <TabsTrigger
                            value="settings"
                            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 bg-transparent border-b-2 border-transparent transition-all"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Sozlamalar
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="dashboard" className="outline-none">
                    <FinanceDashboard stats={stats} loading={loading} />
                </TabsContent>

                <TabsContent value="transactions" className="outline-none">
                    <FinanceTransactions />
                </TabsContent>

                <TabsContent value="bot_verification" className="outline-none">
                    <AdminBotPayments />
                </TabsContent>

                <TabsContent value="settings" className="outline-none">
                    <FinanceSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}
