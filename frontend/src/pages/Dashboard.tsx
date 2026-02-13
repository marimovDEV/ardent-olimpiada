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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 animate-fade-in pb-24 text-foreground min-h-screen">

      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#0B132B] to-[#1C2541] border border-white/10 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest animate-pulse-soft">
                {t('dashboard.hero.welcomeBack', 'Xush kelibsiz!')}
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{t('dashboard.hero.online', 'Online')}</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
              {t('dashboard.hero.greeting', 'Salom')}, <span className="text-primary italic">{data.hero?.user_name || 'Talaba'}!</span>
            </h1>

            <p className="text-lg text-blue-100/60 max-w-xl font-medium leading-relaxed">
              {t('dashboard.hero.subtitle', 'Sizning bugun uchun 3 ta vazifangiz bor. Olg‘a, yangi cho‘qqilarni zabt etamiz!')}
            </p>
          </div>

          {/* Level Badge Premium */}
          <div className="relative group cursor-help" onClick={() => setIsProgressModalOpen(true)}>
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-colors duration-500" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-primary-dark p-1 shadow-gold transform group-hover:rotate-12 transition-transform duration-500">
              <div className="w-full h-full bg-[#0B132B] rounded-full flex flex-col items-center justify-center border-4 border-[#0B132B]">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest font-cinzel">{t('common.level', 'Level')}</span>
                <span className="text-5xl md:text-6xl font-black text-white leading-none">{data.level.current}</span>
                <Zap className="w-5 h-5 text-primary mt-1 animate-bounce fill-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar Premium */}
        <div className="mt-12 space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest font-cinzel">Current XP</span>
                <span className="text-2xl font-black text-white">{data.level.xp_current} <span className="text-sm font-medium text-white/40">/ 500</span></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-cinzel">{t('dashboard.widgets.xpLeft', { xp: data.level.xp_left })}</span>
              <p className="text-sm font-black text-primary tracking-tighter">{data.level.progress_percent}% {t('common.completed', 'Tayyor')}</p>
            </div>
          </div>
          <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.level.progress_percent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary-dark via-primary to-primary-light rounded-full shadow-gold relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
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
          label={t('dashboard.stats.totalXp', 'Jami XP')}
          value={data.level.xp_current + (data.level.current - 1) * 500}
          icon={Trophy}
          color="primary"
          delay={0.2}
        />
        <DashboardStatCard
          label={t('dashboard.stats.rank', 'Reyting')}
          value="#12"
          icon={Trophy}
          trend="Top 5%"
          color="blue-500"
          delay={0.3}
        />
        <DashboardStatCard
          label={t('dashboard.stats.certificates', 'Sertifikatlar')}
          value="4"
          icon={Award}
          color="purple-500"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-10">

          {/* Courses / Learning */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <PlayCircle className="w-6 h-6 text-primary" />
                {t('dashboard.sections.continueLearning', 'O\'rganishda davom eting')}
              </h2>
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl">
                {t('common.viewAll', 'Hammasi')} →
              </Button>
            </div>

            <div className="animate-pop-in">
              <SmartCourseList courses={data.enrolled_courses} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                {t('dashboard.sections.stats', 'Analitika')}
              </h3>
              <AnalyticsResults />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {t('dashboard.sections.subjects', 'Fanlar')}
              </h3>
              <SubjectStats stats={data.subject_stats} />
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div className="glass-card-premium p-6 rounded-[2.5rem] border-white/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              {t('dashboard.sections.dailyMission', 'Kunlik Vazifa')}
            </h3>
            <DailyMissionCard mission={data.mission} />
          </div>

          <div className="glass-card-premium p-6 rounded-[2.5rem] border-white/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
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
