import { Suspense, lazy, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const WizardHero = () => {
    const [hasError, setHasError] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const sceneUrl = "https://prod.spline.design/OKp79S2X5IWDcl-F/scene.splinecode";

    useEffect(() => {
        // Proactively check if the Spline scene is accessible
        fetch(sceneUrl, { method: 'HEAD' })
            .then(res => {
                if (!res.ok) {
                    setHasError(true);
                }
            })
            .catch(() => {
                setHasError(true);
            })
            .finally(() => {
                setIsChecking(false);
            });
    }, []);

    const FallbackCard = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-80 h-96 bg-[#111827] rounded-[3rem] border-2 border-primary/20 shadow-2xl overflow-hidden gold-glow mx-auto"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                    <Trophy className="w-12 h-12 text-primary" />
                </div>
                <div>
                    <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">HOGWARTS PRESTIGE</div>
                    <div className="text-2xl font-black text-white font-cinzel">ELITE MEMBER</div>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary"
                    />
                </div>
            </div>
        </motion.div>
    );

    if (isChecking) {
        return (
            <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                <div className="w-24 h-24 bg-primary/10 rounded-full animate-pulse border-2 border-primary/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping" />
                </div>
            </div>
        );
    }

    if (hasError) {
        return <FallbackCard />;
    }

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full h-[600px] lg:h-[800px] relative z-20"
            >
                <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full animate-pulse border-2 border-primary/20 flex items-center justify-center">
                            <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping" />
                        </div>
                    </div>
                }>
                    <Spline
                        className="w-full h-full pointer-events-auto"
                        scene={sceneUrl}
                        onError={() => setHasError(true)}
                    />
                </Suspense>
            </motion.div>

            {/* Decorative Magic Orbs */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-[10%] w-32 h-32 bg-primary/20 blur-[80px] rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 left-[10%] w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full"
                />
            </div>
        </div>
    );
};

export default WizardHero;
