import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, Award, Trophy, Zap, PlayCircle, BookOpen, Star, Crown, History, ArrowRight, ChevronDown, ChevronUp, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import RecentActivity from "@/components/dashboard/RecentActivity";
import DailyGoals from "@/components/dashboard/DailyGoals";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import TelegramStatus from "@/components/dashboard/TelegramStatus";
import SubjectStats from "@/components/dashboard/SubjectStats";
import LevelProgressModal from "@/components/dashboard/LevelProgressModal";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import { API_URL, getAuthHeader, getImageUrl } from "@/services/api";

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
    streak_days?: number;
    [key: string]: any;
  };
  telegram: any;
  subject_stats: any[];
  active_profession: any;
  enrolled_courses: any[];
}

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubjects, setShowSubjects] = useState(false);

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-card rounded-[2rem] border border-border m-4 shadow-sm">
        <AlertTriangle className="w-16 h-16 text-primary mb-6 animate-pulse" />
        <h2 className="text-2xl font-black text-foreground mb-4 tracking-tight">{t('dashboard.widgets.error')}</h2>
        <p className="text-muted-foreground mb-8 font-medium max-w-md">{error || t('dashboard.widgets.noData')}</p>
        <Button onClick={fetchDashboardData} className="bg-primary text-background h-12 px-8 rounded-xl font-bold shadow-md hover:scale-105 transition-all">
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

  const continueCourse = data.enrolled_courses?.[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pb-24 selection:bg-primary/30 w-full animate-fade-in overflow-x-hidden md:max-w-xl md:mx-auto lg:max-w-3xl border-x border-border/10">

      {/* 2. TRUE HERO SECTION / PREMIUM GRADIENT CARD */}
      <div className="mx-4 mt-4 p-5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => setIsProgressModalOpen(true)}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 space-y-4">

          {/* Top User Row */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black leading-tight">
                👋 Salom, {data.hero?.user_name || 'Talaba'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm inline-flex">
                  Lvl {data.level.current}
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                  <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  #{data.hero?.ranking || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar inside hero card */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] font-bold text-white/90">
              <span>XP Progress</span>
              <span>{data.level.xp_current} / 500 XP</span>
            </div>
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.level.progress_percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 w-1/2 rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY QUICK ACTION */}
      <button
        onClick={() => continueCourse ? navigate(`/course/${continueCourse.id}`) : navigate('/courses')}
        className="mx-4 mt-4 w-[calc(100%-2rem)] py-3 h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <PlayCircle className="w-5 h-5" />
        {continueCourse ? "Kursni davom ettirish" : "Kurs topish"}
      </button>

      {/* 4. BUGUNGI MAQSAD (Moved up) */}
      <div className="px-4 mt-6">
        <DailyGoals />
      </div>

      {/* 5. STATS GRID 2x2 */}
      <div className="grid grid-cols-2 gap-4 mt-6 mx-4">
        {/* Streak */}
        <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Streak</span>
          </div>
          <div className="text-xl font-black text-foreground">{data.hero?.streak_days || 0} Kun</div>
        </div>

        {/* Total XP (Current Level points + previously earned) */}
        <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Umumiy XP</span>
          </div>
          <div className="text-xl font-black text-foreground">{(data.level?.xp_current || 0) + ((data.level?.current || 1) - 1) * 500}</div>
        </div>

        {/* Rank */}
        <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reyting</span>
          </div>
          <div className="text-xl font-black text-foreground italic">#{data.hero?.ranking || 0}</div>
        </div>

        {/* Certs */}
        <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-sm border border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sertifikatlar</span>
          </div>
          <div className="text-xl font-black text-foreground">{data.hero?.certificates_count || 0} ta</div>
        </div>
      </div>

      {/* 6. MINI KURSLARIM */}
      {data.enrolled_courses && data.enrolled_courses.length > 0 && (
        <div className="px-4 mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-muted-foreground pl-1">Mini-Kurslarim</h2>
            <Link to="/my-courses" className="text-xs font-bold text-indigo-600 active:scale-95 transition">Hammasi</Link>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
            {data.enrolled_courses.slice(0, 3).map((course: any) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="min-w-[280px] w-[280px] snap-center bg-white dark:bg-card rounded-2xl shadow-md border border-border/50 overflow-hidden flex-shrink-0 active:scale-[0.98] transition-transform"
              >
                <div className="h-32 bg-muted relative">
                  {course.thumbnail ? (
                    <img src={getImageUrl(course.thumbnail)} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-indigo-300" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-background/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-primary shadow-sm">
                    {course.subject || "Umumiy"}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[15px] line-clamp-1 mb-3">{course.title}</h3>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium text-muted-foreground">Progress</span>
                    <span className="text-[11px] font-black text-indigo-600">{course.progress || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 7. SO'NGGI FAOLIYAT & KALENDAR (VERY BOTTOM) */}
      <div className="px-4 mt-2 space-y-6">
        <RecentActivity />

        <div className="bg-white dark:bg-card border border-border p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-[15px]">Faollik kalendari</h3>
          </div>
          <StreakCalendar calendar={data.calendar} />
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
