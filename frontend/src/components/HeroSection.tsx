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
      {/* Background Visuals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full opacity-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
              >
                <Trophy className="w-4 h-4" />
                {t('hero.badge', 'Eng yaxshi olimpiadalar platformasi')}
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-black font-cinzel leading-[1.05] tracking-tighter text-white">
                Kelajagingizni <br />
                <span className="text-primary italic gold-glow">Olimpiada</span> <br />
                G'alabalari bilan Quring
              </h1>

              <p className="text-xl md:text-2xl font-medium italic text-secondary leading-relaxed font-cinzel max-w-xl">
                "Magic of Knowledge & <br /> Olympiad Excellence"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-16 px-10 text-lg rounded-2xl bg-primary text-background font-black shadow-gold hover:scale-105 transition-all" asChild>
                <Link to="/all-olympiads">
                  🟢 Olimpiadaga qatnashish
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl border-white/10 text-white font-black hover:bg-white/5 transition-all" asChild>
                <Link to="/all-courses">
                  ⚪ Tayyorgarlik kurslari
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Floating 3D Elements */}
          <div className="relative hidden lg:block perspective-1000">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1 }}
              className="relative aspect-square"
            >
              {/* Main "Floating" Shield/Logo Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-[#111827] rounded-[3rem] border-2 border-primary/30 shadow-2xl overflow-hidden animate-float rotate-y-12 gold-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20">
                    <Trophy className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">HOGWORDS PRESTIGE</div>
                    <div className="text-2xl font-black text-white font-cinzel">ELITE MEMBER</div>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-primary" />
                  </div>
                </div>
              </div>

              {/* Smaller Floating Cards */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-48 h-48 bg-[#1F2937]/80 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6 shadow-xl animate-tilt translate-x-12 -translate-y-12"
              >
                <div className="h-full flex flex-col justify-between">
                  <Star className="w-8 h-8 text-primary fill-primary" />
                  <div className="space-y-2">
                    <div className="text-xs font-black text-white italic">Sertifikatlar</div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full" />
                    <div className="w-1/2 h-1.5 bg-white/10 rounded-full" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-0 w-56 h-32 bg-[#1F2937]/80 backdrop-blur-md rounded-[2rem] border border-white/10 p-6 shadow-xl -translate-x-16 translate-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#94A3B8] uppercase">Muvaffaqiyat</div>
                    <div className="text-lg font-black text-white">100% Shaffof</div>
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
