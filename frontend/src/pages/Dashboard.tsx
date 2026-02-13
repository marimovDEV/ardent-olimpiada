import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

import StreakHero from "@/components/dashboard/StreakHero";
import DailyMissionCard from "@/components/dashboard/DailyMissionCard";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import TelegramStatus from "@/components/dashboard/TelegramStatus";
import StudentProfileCard from "@/components/dashboard/StudentProfileCard";
import SmartCourseList from "@/components/dashboard/SmartCourseList";
import AnalyticsResults from "@/components/dashboard/AnalyticsResults";
import SubjectStats from "@/components/dashboard/SubjectStats";
import ProfessionRoadmap from "@/components/dashboard/ProfessionRoadmap";
import LevelProgressModal from "@/components/dashboard/LevelProgressModal";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import { Zap } from "lucide-react";

interface DashboardData {
  has_active_courses: boolean;
  recommended_courses?: any[];
  featured_subjects?: any[];
  featured_professions?: any[];
  hero: any;
  mission: any;
  calendar: any[];
  level: any;
  telegram: any;
  subject_stats: any[];
  active_profession: any;
  enrolled_courses: any[];
}

import { API_URL } from "@/services/api";

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
        console.error("Dashboard Fetch Error:", res.status, errText);
        setError(`Failed to load dashboard: ${res.status}`);
      }
    } catch (e: any) {
      console.error("Network Error:", e);
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-primary mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2 font-cinzel">{t('dashboard.widgets.error')}</h2>
        <p className="text-muted-foreground mb-4 font-medium">{error || t('dashboard.widgets.noData')}</p>
        <Button onClick={fetchDashboardData} variant="outline" className="text-foreground border-primary/20 hover:bg-primary/5 rounded-xl font-bold">
          {t('dashboard.widgets.tryAgain')}
        </Button>
      </div>
    );
  }

  if (!data.has_active_courses) {
    return (
      <DashboardEmptyState
        recommendedCourses={data.recommended_courses}
        featuredSubjects={data.featured_subjects}
        featuredProfessions={data.featured_professions}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 animate-fade-in pb-24 text-foreground min-h-screen relative z-10">

      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative overflow-hidden rounded-[3.5rem] bg-card border border-card-border p-8 md:p-14 shadow-2xl group">
        {/* Animated Background Glows */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/20 via-primary/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-5 py-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse-soft">
                {t('dashboard.hero.welcomeBack', 'Xush kelibsiz!')}
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{t('dashboard.hero.online', 'Online')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">
                {t('dashboard.hero.greeting', 'Salom')}, <span className="bg-gradient-to-r from-[#7C3AED] via-[#22D3EE] to-[#7C3AED] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-xy italic">{data.hero?.user_name || 'Talaba'}!</span>
              </h1>
              <p className="text-xl text-secondary max-w-xl font-medium leading-relaxed">
                {t('dashboard.hero.subtitle', 'Sizning bugun uchun 3 ta vazifangiz bor. Olg‘a, yangi cho‘qqilarni zabt etamiz!')}
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white leading-none">150,000</span>
                  <span className="text-sm font-black text-secondary uppercase tracking-tighter">AC</span>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">Streak</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white leading-none">{data.hero?.streak_days || 1}</span>
                  <Zap className="w-5 h-5 text-orange-400 fill-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Level Badge Premium */}
          <div className="relative group cursor-pointer" onClick={() => setIsProgressModalOpen(true)}>
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-[60px] group-hover:bg-primary/50 transition-all duration-700 opacity-60" />
            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-primary via-secondary to-primary p-1.5 shadow-purple transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
              <div className="w-full h-full bg-background rounded-full flex flex-col items-center justify-center border-4 border-background relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5" />
                <span className="text-[11px] font-black text-secondary uppercase tracking-[0.3em] font-cinzel relative z-10 mb-1">{t('common.level', 'Level')}</span>
                <span className="text-7xl md:text-8xl font-black text-primary leading-none relative z-10 tracking-tighter">{data.level.current}</span>
                <Zap className="w-6 h-6 text-primary mt-2 animate-bounce fill-primary relative z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar Premium */}
        <div className="mt-16 space-y-4">
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-cinzel">Experience Points</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-primary tracking-tighter">{data.level.xp_current}</span>
                <span className="text-sm font-bold text-secondary font-cinzel">/ 500 XP</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] font-cinzel block mb-1">Next Level in {data.level.xp_left} XP</span>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black text-secondary tracking-tighter">{data.level.progress_percent}%</span>
                <span className="text-[10px] font-bold text-secondary uppercase">{t('common.completed', 'Ready')}</span>
              </div>
            </div>
          </div>
          <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-card-border p-[3px] shadow-inner relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.level.progress_percent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#7C3AED] via-[#22D3EE] to-[#7C3AED] bg-[length:200%_auto] animate-gradient-xy rounded-full relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              <div className="absolute -inset-y-2 right-0 w-8 bg-[#22D3EE]/30 blur-md rounded-full animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STAT CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <DashboardStatCard
          label={t('dashboard.stats.streak', 'Streak')}
          value={`${data.hero?.streak_days || 0} ${t('common.days', 'Kun')}`}
          icon={Zap}
          trend="+2"
          color="orange-500"
          delay={0.1}
        />
        <DashboardStatCard
          label={t('dashboard.stats.totalXp', 'Total XP')}
          value={data.level.xp_current + (data.level.current - 1) * 500}
          icon={Trophy}
          color="primary"
          delay={0.2}
        />
        <DashboardStatCard
          label={t('dashboard.stats.rank', 'Ranking')}
          value="#12"
          icon={Trophy}
          trend="Top 5%"
          color="cyan"
          delay={0.3}
        />
        <DashboardStatCard
          label={t('dashboard.stats.certificates', 'Sertifikatlar')}
          value="4"
          icon={Award}
          color="yellow"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-12">

          {/* Motivational Start Learning Section */}
          <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent p-1 shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl rounded-[2.4rem]" />
            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-2xl font-black text-white flex items-center justify-center md:justify-start gap-3">
                  <PlayCircle className="w-8 h-8 text-secondary animate-pulse" />
                  🚀 O‘rganishni bugun boshlang
                </h3>
                <p className="text-secondary font-medium max-w-md">
                  XP yig‘ing, darajani oshiring va reytingda ko‘tariling! Bugun <strong>500 XP</strong> yutish imkoniyati bor.
                </p>
              </div>
              <Button className="bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:scale-105 transition-all duration-300 rounded-2xl h-14 px-10 text-white font-black text-lg shadow-purple hover:shadow-[#22D3EE]/40">
                Kurslarni boshlash
              </Button>
            </div>
          </section>

          {/* Courses / Learning */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                {t('dashboard.sections.continueLearning', 'O\'rganishda davom eting')}
              </h2>
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-xl h-10">
                {t('common.viewAll', 'Hammasi')} →
              </Button>
            </div>

            <div className="animate-pop-in">
              <SmartCourseList courses={data.enrolled_courses} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-3 text-primary px-2">
                <Trophy className="w-5 h-5 text-secondary" />
                {t('dashboard.sections.stats', 'Analitika')}
              </h3>
              <div className="bg-background-secondary border border-card-border rounded-[2.5rem] p-6 shadow-xl">
                <AnalyticsResults />
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-black flex items-center gap-3 text-primary px-2">
                <Zap className="w-5 h-5 text-primary" />
                {t('dashboard.sections.subjects', 'Fanlar')}
              </h3>
              <div className="bg-background-secondary border border-card-border rounded-[2.5rem] p-6 shadow-xl">
                <SubjectStats stats={data.subject_stats} />
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-10">
          <div className="bg-background-secondary border border-card-border p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
            <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-primary">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-orange-500" />
              </div>
              {t('dashboard.sections.dailyMission', 'Kunlik Vazifa')}
            </h3>
            <DailyMissionCard mission={data.mission} />
          </div>

          <div className="bg-background-secondary border border-card-border p-8 rounded-[3rem] shadow-2xl">
            <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-primary">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <PlayCircle className="w-4 h-4 text-secondary" />
              </div>
              {t('dashboard.sections.activity', 'Faollik')}
            </h3>
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
