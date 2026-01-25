import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SubjectsSection from "@/components/SubjectsSection";
import FeaturesSection from "@/components/FeaturesSection";
import OlympiadSection from "@/components/OlympiadSection";
import WinnersSection from "@/components/WinnersSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TrustSection from "@/components/landing/TrustSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TrustSection />
        <SubjectsSection />
        <OlympiadSection />
        <WinnersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
