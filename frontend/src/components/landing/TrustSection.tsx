import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Trophy, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

const TrustSection = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: ShieldCheck,
            title: "Shaffof natijalar",
            description: "Barcha olimpiada natijalari real vaqt rejimida hisoblanadi va blokcheyn kabi shaffof tizimda saqlanadi.",
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            icon: GraduationCap,
            title: "Professional mentorlar",
            description: "Xalqaro darajadagi tajribaga ega bo'lgan mutaxassislar va fan olimpiadalari g'oliblaridan bilim oling.",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: Trophy,
            title: "Real mukofotlar",
            description: "G'oliblar nafaqat bilim, balki qimmatbaho sovg'alar va xalqaro sertifikatlarga ega bo'lishadi.",
            color: "text-orange-400",
            bg: "bg-orange-400/10"
        }
    ];

    return (
        <section className="py-24 relative bg-[#0B0F1A] overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="outline" className="px-6 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 backdrop-blur-sm font-black uppercase tracking-widest">
                            Nega HOGWORDS?
                        </Badge>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-white font-cinzel tracking-tight">
                        G‘alaba <span className="text-primary italic">Tasodif</span> Emas
                    </h2>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-[#111827] border border-white/5 hover:border-primary/20 transition-all duration-300 group flex items-start md:flex-col gap-6 md:gap-0"
                        >
                            <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl ${feature.bg} flex items-center justify-center md:mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-7 h-7 md:w-8 md:h-8 ${feature.color}`} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-4 font-cinzel">{feature.title}</h3>
                                <p className="text-secondary text-sm md:text-base font-medium leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="mt-4 md:mt-8 flex flex-wrap gap-3">
                                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-white/40">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Verified System
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
