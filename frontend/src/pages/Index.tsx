import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import TimelineSection from "@/components/home/TimelineSection";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";

// Lazy load redesigned sections
const PrideCarousel = lazy(() => import("@/components/PrideCarousel"));
const OlympiadSection = lazy(() => import("@/components/OlympiadSection"));
const ProfessionsCarousel = lazy(() => import("@/components/home/ProfessionsCarousel"));
const TeachersSection = lazy(() => import("@/components/home/TeachersSection"));
const LeadForm = lazy(() => import("@/components/home/LeadForm"));
const SubjectsSection = lazy(() => import("@/components/SubjectsSection"));

import { homepageService, HomePageConfig } from "@/services/homepageService";
import { useEffect, useState } from "react";

const SectionSkeleton = () => (
  <div className="w-full h-[600px] animate-pulse bg-white/5 rounded-[3rem] my-12" />
);

const Index = () => {
  const [config, setConfig] = useState<HomePageConfig | null>(null);

  useEffect(() => {
    homepageService.getConfig().then(res => setConfig(res.config)).catch(console.error);
  }, []);
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0B0F1A] selection:bg-primary selection:text-background">
      <Helmet>
        <title>HOGWORDS | Nufuzli va Professional Olimpiada Platformasi</title>
        <meta name="description" content="Eng sara mentorlar va nufuzli olimpiadalar platformasi." />
      </Helmet>

      {/* 1. Cinematic Hero Section */}
      <HeroSection />

      {/* 2. Trust Bar */}
      <TrustBar />

      <main className="relative">
        <Suspense fallback={<SectionSkeleton />}>
          {/* 3. Subjects Interactive Grid */}
          <SubjectsSection />

          {/* 4. TimelineSection */}
          <TimelineSection />

          {/* 5. TeachersSection (Elite Mentors) */}
          <TeachersSection />

          {/* 6. OlympiadSection (Luxury Showcase) */}
          <OlympiadSection />

          {/* 7. Winners Wall (PrideCarousel) */}
          <PrideCarousel />

          {/* 8. ProfessionsCarousel */}
          <ProfessionsCarousel />

          {/* 9. LeadForm (Free Consultation) */}
          <LeadForm />

          {/* 10. Final CTA */}
          <FinalCTA />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
