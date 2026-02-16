import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const FinalCTA = () => {
    const { t } = useTranslation();

    return (
        <section className="py-24 relative overflow-hidden bg-[#0B132B]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.05),transparent_50%)]" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto space-y-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Kelajakingizni Bugun Boshlang
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-white font-cinzel leading-[1.1] tracking-tighter">
                        O'z bilimingizni <span className="text-primary italic">isbotlash</span> vaqti keldi
                    </h2>

                    <p className="text-xl text-secondary max-w-2xl mx-auto font-medium italic">
                        "Magic of Knowledge & Olympiad Excellence"
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <Link to="/auth/register">
                            <Button size="lg" className="h-16 px-12 rounded-2xl bg-primary text-background font-black text-xl shadow-gold hover:scale-105 transition-all">
                                Ro'yxatdan o'tish <ArrowRight className="w-6 h-6 ml-3" />
                            </Button>
                        </Link>
                        <Link to="/all-olympiads">
                            <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl border-white/10 text-white font-black hover:bg-white/5 transition-all">
                                Olimpiadalar
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
