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
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20 bg-background text-foreground">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* --- LEFT COLUMN (Main Content) [Takes 3/4 space] --- */}
        <div className="lg:col-span-3 space-y-8">

          {/* 1. Hero Section */}
          <div className="animate-pop-in layer-1">
            <StreakHero data={data.hero} />
          </div>

          {/* 2. Mission & Actions */}
          <div className="animate-pop-in layer-2" style={{ animationDelay: '100ms' }}>
            <DailyMissionCard mission={data.mission} />
          </div>

          {/* 3. Subjects Section */}
          <div className="animate-pop-in layer-3" style={{ animationDelay: '200ms' }}>
            <SubjectStats stats={data.subject_stats} />
          </div>

          {/* 4. Courses List */}
          <div className="animate-pop-in layer-4" style={{ animationDelay: '300ms' }}>
            <SmartCourseList courses={data.enrolled_courses} />
          </div>

          {/* 5. Analytics & More */}
          <div className="animate-pop-in layer-5" style={{ animationDelay: '400ms' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProfessionRoadmap profession={data.active_profession} />
              <AnalyticsResults />
            </div>
          </div>

        </div>


        {/* --- RIGHT COLUMN (Sidebar) [Takes 1/4 space] --- */}
        <div className="space-y-8 lg:col-span-1">

          {/* 1. Profile Summary (Compact) */}
          <div className="animate-pop-in layer-1">
            <StudentProfileCard />
          </div>

          {/* 2. Streak Calendar */}
          <div className="animate-pop-in layer-2" style={{ animationDelay: '150ms' }}>
            <StreakCalendar calendar={data.calendar} />
          </div>

          {/* 3. Level Progress */}
          <div
            className="animate-pop-in layer-3 cursor-pointer group/level transition-all hover:scale-[1.02]"
            style={{ animationDelay: '250ms' }}
            onClick={() => setIsProgressModalOpen(true)}
          >
            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-gold hover:border-primary/50 transition-all duration-500">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-3 flex items-center justify-between font-cinzel">
                  {t('dashboard.widgets.levelProgress')}
                  <Zap className="w-4 h-4 text-primary animate-pulse fill-primary" />
                </h3>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-3xl font-black text-foreground font-cinzel">LVM {data.level.current}</span>
                  <span className="text-primary font-black text-xs">{t('dashboard.widgets.xpLeft', { xp: data.level.xp_left })}</span>
                </div>
                <div className="h-4 bg-secondary-light/30 rounded-full overflow-hidden mb-3 border border-white/5 p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-primary-dark via-primary to-primary-light rounded-full transition-all duration-1000 shadow-gold"
                    style={{ width: `${data.level.progress_percent}%` }}
                  />
                </div>
                <p className="text-[10px] font-black text-primary uppercase text-right group-hover:translate-x-1 transition-transform font-cinzel">
                  {t('common.details')} →
                </p>
              </div>
            </div>
          </div>

          {/* 4. Telegram Status */}
          <div className="animate-pop-in layer-4" style={{ animationDelay: '350ms' }}>
            <TelegramStatus
              status={data.telegram}
              onConnect={handleConnectTelegram}
              isLoading={isLinking}
            />
          </div>

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
