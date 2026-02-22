"use client";

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";

const Spline = lazy(() => import("@splinetool/react-spline"));

const WizardHero = () => {
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
                        scene="https://prod.spline.design/OKp79S2X5IWDcl-F/scene.splinecode"
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
