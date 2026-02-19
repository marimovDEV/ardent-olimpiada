import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, Award, Trophy, Zap, PlayCircle, BookOpen, Star, Crown, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ArdCoin from "@/components/ArdCoin";

import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DailyGoals from "@/components/dashboard/DailyGoals";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import TelegramStatus from "@/components/dashboard/TelegramStatus";
import SmartCourseList from "@/components/dashboard/SmartCourseList";
import AnalyticsResults from "@/components/dashboard/AnalyticsResults";
import SubjectStats from "@/components/dashboard/SubjectStats";
import LevelProgressModal from "@/components/dashboard/LevelProgressModal";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import { API_URL } from "@/services/api";

interface DashboardData {
  has_active_courses: boolean;
  recommended_courses?: any[];
  featured_subjects?: any[];
  featured_professions?: any[];
  mission: any;
  calendar: any[];
  level: any;
  hero: {
    user_name: string;
    balance: number;
    ranking: number;
    certificates_count: number;
    [key: string]: any;
  };
  telegram: any;
  subject_stats: any[];
  active_profession: any;
  enrolled_courses: any[];
}

const Dashboard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      const res = await fetch(`${API_URL}/gamification/dashboard/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        const errText = await res.text();
        setError(`Failed to load dashboard: ${res.status}`);
      }
    } catch (e: any) {
      setError(`Network error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectTelegram = async () => {
    const token = localStorage.getItem('token');
    setIsLinking(true);
    try {
      const res = await fetch(`${API_URL}/bot/link-token/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.bot_url) {
        window.open(json.bot_url, '_blank');
      }
    } finally {
      setIsLinking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-[#111827] rounded-[3rem] border border-white/5 m-4">
        <AlertTriangle className="w-16 h-16 text-primary mb-6 animate-pulse" />
        <h2 className="text-3xl font-black text-white mb-4 font-cinzel tracking-tight">{t('dashboard.widgets.error')}</h2>
        <p className="text-secondary mb-8 font-medium italic opacity-60 max-w-md">{error || t('dashboard.widgets.noData')}</p>
        <Button onClick={fetchDashboardData} className="bg-primary text-background h-14 px-10 rounded-2xl font-black shadow-gold hover:scale-105 transition-all">
          {t('dashboard.widgets.tryAgain')}
        </Button>
      </div>
    );
  }

  if (!data.has_active_courses && (data.recommended_courses?.length === 0 || !data.recommended_courses)) {
    return (
      <DashboardEmptyState
        recommendedCourses={data.recommended_courses}
        featuredSubjects={data.featured_subjects}
        featuredProfessions={data.featured_professions}
      />
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto space-y-12 animate-fade-in pb-32 relative z-10">

      {/* 1. PREMIUM HERO SECTION 2.0 */}
      <section className="relative overflow-hidden rounded-[3rem] bg-[#111827] border border-white/5 p-10 md:p-16 shadow-2xl group">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(circle_at_100%_0%,rgba(250,204,21,0.1),transparent_70%)] opacity-60" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-10">
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="outline" className="px-5 py-1.5 text-[10px] border-primary/30 text-primary bg-primary/5 backdrop-blur-sm font-black uppercase tracking-[0.2em] rounded-full">
                {t('dashboard.hero.welcomeBack', "OG'ABEK, XUSH KELIBSIZ!")}
              </Badge>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Live Academy</span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none font-cinzel">
                👋 Salom, <span className="gold-glow italic">{data.hero?.user_name || 'Hogwartian'}</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium italic font-cinzel opacity-80">
                {t('dashboard.hero.subtitle', "Bugun sizni katta yutuqlar va yangi bilimlar kutmoqda. Tayyormisiz?")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-12 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <ArdCoin amount={data.hero?.balance || 0} size="xl" className="scale-125" />
                </div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div className="space-y-1">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] opacity-60">Current Rank</span>
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-primary" />
                  <span className="text-4xl font-black text-white italic font-cinzel">#{data.hero?.ranking || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative group cursor-pointer" onClick={() => setIsProgressModalOpen(true)}>
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-all duration-700" />
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary via-primary-dark to-[#CA8A04] p-2 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-6">
                <div className="w-full h-full bg-[#0B0F1A] rounded-full flex flex-col items-center justify-center border-[6px] border-[#0B0F1A] relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-[40%] bg-primary/5" />
                  <span className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] font-cinzel mb-2 opacity-60">Level</span>
                  <span className="text-8xl md:text-9xl font-black text-white leading-none tracking-tighter italic font-cinzel gold-glow">{data.level.current}</span>
                  <div className="mt-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary fill-primary animate-pulse" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Master</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar integrated in Hero */}
        <div className="mt-16 space-y-5">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-cinzel">Next Level Progress</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white italic font-cinzel leading-none">{data.level.xp_current}</span>
                <span className="text-sm font-black text-muted-foreground uppercase opacity-60">/ 500 XP</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] font-cinzel opacity-40">Ready to Evolve</span>
              <div className="text-2xl font-black text-primary italic font-cinzel">{data.level.progress_percent}%</div>
            </div>
          </div>
          <div className="h-5 bg-[#0B0F1A] rounded-full overflow-hidden border border-white/5 p-[4px] relative group shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.level.progress_percent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-primary rounded-full relative overflow-hidden shadow-gold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS */}
      <QuickActions />

      {/* 3. CORE GAMIFICATION STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard
          label={t('dashboard.stats.streak', 'STREAK')}
          value={`${data.hero?.streak_days || 0} KUN`}
          icon={Zap}
          trend="🔥 On Fire"
          color="orange"
        />
        <DashboardStatCard
          label={t('dashboard.stats.totalXp', 'TOTAL XP')}
          value={data.level.xp_current + (data.level.current - 1) * 500}
          icon={Trophy}
          trend="🚀 Level Top"
          color="primary"
        />
        <DashboardStatCard
          label={t('dashboard.stats.rank', 'RANKING')}
          value={`#${data.hero?.ranking || 0}`}
          icon={Crown}
          trend="🏆 Top 5%"
          color="primary"
        />
        <DashboardStatCard
          label={t('dashboard.stats.certificates', 'CERTIFICATES')}
          value={`${data.hero?.certificates_count || 0}`}
          icon={Award}
          trend="✨ Certified"
          color="yellow"
        />
      </div>

      {/* 4. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left side: Main Goals & Learning */}
        <div className="lg:col-span-8 space-y-12">

          {/* Daily Goals Checklist - Top Priority */}
          <div className="animate-slide-up">
            <DailyGoals />
          </div>

          {/* Learning Section */}
          <div className="space-y-10">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-white flex items-center gap-4 font-cinzel tracking-tight">
                  <BookOpen className="w-10 h-10 text-primary" />
                  O'RGANISHNI DAVOM ETTIRING
                </h2>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-60">Never stop growing</p>
              </div>
              <Link to="/my-courses">
                <Button variant="ghost" className="h-12 px-6 rounded-xl border border-white/5 hover:bg-white/5 text-secondary font-black uppercase tracking-widest text-[10px] transition-all">
                  HAMMASI <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="animate-pop-in">
              <SmartCourseList courses={data.enrolled_courses} />
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="space-y-10 pt-10">
            <div className="space-y-1 px-2">
              <h2 className="text-3xl font-black text-white flex items-center gap-4 font-cinzel tracking-tight">
                <Star className="w-10 h-10 text-primary" />
                YO'NALISHLAR
              </h2>
              <p className="text-[10px] text-secondary font-black uppercase tracking-[0.3em] opacity-60">Expertise areas</p>
            </div>
            <SubjectStats stats={data.subject_stats} />
          </div>
        </div>

        {/* Right side: Activity & Secondary Info */}
        <div className="lg:col-span-4 space-y-10">

          {/* Recent Activity Feed */}
          <div className="bg-[#111827] border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl opacity-50" />
            <div className="space-y-1 relative z-10">
              <h3 className="text-xl font-black text-white flex items-center gap-3 font-cinzel uppercase tracking-tight">
                <History className="w-6 h-6 text-primary" />
                SO'NGGI FAOLIYAT
              </h3>
              <p className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-40">Your timeline</p>
            </div>
            <RecentActivity />
          </div>

          {/* Weekly Activity Calendar */}
          <div className="bg-[#111827] border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-8">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-3 font-cinzel uppercase tracking-tight">
                <Zap className="w-6 h-6 text-orange-400" />
                FAOLLIK KALENDARI
              </h3>
              <p className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-40">Consistency is key</p>
            </div>
            <StreakCalendar calendar={data.calendar} />
          </div>

          <TelegramStatus
            status={data.telegram}
            onConnect={handleConnectTelegram}
            isLoading={isLinking}
          />
        </div>
      </div>

      <LevelProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        user={{ ...data, xp: data.level.xp_current + (data.level.current - 1) * 500 }}
      />
    </div>
  );
};

export default Dashboard;
