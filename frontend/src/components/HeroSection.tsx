import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Star, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { homepageService, HeroConfig, Banner } from "@/services/homepageService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#0B0F1A] min-h-screen flex items-center">
      {/* Subtle Magic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-40 md:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 30%, rgba(250,204,21,0.12), transparent 60%)`
          }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-wider"
              >
                <Trophy className="w-4 h-4" />
                {t('hero.badge', 'G‘alaba tasodif emas')}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-7xl lg:text-8xl font-black font-cinzel leading-[1.2] tracking-tight text-white"
              >
                Kelajagingizni <br />
                <span className="text-primary italic gold-glow px-1">bugun</span> <br className="md:hidden" />
                boshlang
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-xl lg:text-2xl font-medium text-secondary/90 leading-relaxed font-cinzel max-w-xl"
              >
                Professional tayyorgarlik • Shaffof olimpiadalar • Real mukofotlar
              </motion.p>

              {/* Mobile Stats Grid - 2x2 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:gap-6 pt-2"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 p-4 md:p-0 rounded-2xl bg-white/[0.03] md:bg-transparent border border-white/5 md:border-none">
                  <div className="text-xl md:text-sm font-bold text-primary">10,000+</div>
                  <div className="text-[10px] md:text-xs font-semibold text-white/40 md:text-white/60 tracking-wider">o'quvchi</div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 p-4 md:p-0 rounded-2xl bg-white/[0.03] md:bg-transparent border border-white/5 md:border-none">
                  <div className="text-xl md:text-sm font-bold text-primary">50+</div>
                  <div className="text-[10px] md:text-xs font-semibold text-white/40 md:text-white/60 tracking-wider">olimpiada</div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 p-4 md:p-0 rounded-2xl bg-white/[0.03] md:bg-transparent border border-white/5 md:border-none">
                  <div className="text-xl md:text-sm font-bold text-primary">4.9</div>
                  <div className="text-[10px] md:text-xs font-semibold text-white/40 md:text-white/60 tracking-wider">baho</div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 p-4 md:p-0 rounded-2xl bg-white/[0.03] md:bg-transparent border border-white/5 md:border-none">
                  <div className="text-xl md:text-sm font-bold text-primary">100%</div>
                  <div className="text-[10px] md:text-xs font-semibold text-white/40 md:text-white/60 tracking-wider">shaffoflik</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button size="lg" className="h-14 md:h-16 px-10 text-base md:text-lg rounded-xl bg-primary text-background font-bold shadow-lg hover:-translate-y-1 transition-all active:scale-95 w-full sm:w-auto" asChild>
                <Link to="/all-olympiads">
                  Olimpiadada qatnashish
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 md:h-16 px-10 text-base md:text-lg rounded-xl border-white/10 text-primary font-bold hover:bg-white/5 transition-all active:scale-95 w-full sm:w-auto" asChild>
                <Link to="/all-courses">
                  Tayyorgarlikni boshlash
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right: Optimized Floating Elements */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square"
            >
              {/* Main Shield Card - Simplified Magic */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-[#111827] rounded-[3rem] border-2 border-primary/20 shadow-2xl overflow-hidden animate-float-slow gold-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                    <Trophy className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">HOGWORDS PRESTIGE</div>
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
              </div>

              {/* Smaller Optimized Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-48 h-48 bg-[#111827]/80 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6 shadow-xl translate-x-12 -translate-y-12"
              >
                <div className="h-full flex flex-col justify-between">
                  <Star className="w-8 h-8 text-primary fill-primary" />
                  <div className="space-y-2">
                    <div className="text-xs font-black text-white italic">Sertifikatlar</div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-primary/30" />
                    </div>
                    <div className="w-1/2 h-1.5 bg-white/10 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
