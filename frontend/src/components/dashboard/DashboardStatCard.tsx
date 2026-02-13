import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color: string;
    delay?: number;
}

const DashboardStatCard = ({ label, value, icon: Icon, trend, color, delay = 0 }: StatCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-white/5 backdrop-blur-xl border border-card-border p-6 rounded-[2rem] relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-300 hover:shadow-purple"
        >
            {/* Decorative Blur */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}/10 rounded-full blur-3xl group-hover:bg-${color}/20 transition-colors duration-500`} />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center text-${color} border border-${color}/20 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <span className="text-[10px] font-black px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                            {trend}
                        </span>
                    )}
                </div>

                <div className="mt-auto">
                    <p className="text-secondary text-[10px] font-black uppercase tracking-widest mb-1 font-cinzel">
                        {label}
                    </p>
                    <h3 className="text-3xl font-black text-primary tracking-tighter">
                        {value}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardStatCard;
