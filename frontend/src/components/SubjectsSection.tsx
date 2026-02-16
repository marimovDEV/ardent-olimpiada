import { Calculator, Atom, Code, Brain, BookOpen, Globe, Trophy, Users, Zap, Award, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { homepageService } from "@/services/homepageService";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Helper for dynamic icons
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name] || BookOpen;
  return <Icon className={className} />;
};

const SubjectsSection = () => {
  const { t } = useTranslation();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await homepageService.getFeaturedSubjects();
        if (data && Array.isArray(data)) {
          setSubjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <section id="subjects" className="py-24 relative bg-[#0B0F1A] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="px-6 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 backdrop-blur-sm font-black uppercase tracking-widest">
              <Zap className="w-4 h-4 mr-2" />
              {t('subjectsSection.badge', "Interactive Grid")}
            </Badge>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white font-cinzel tracking-tight leading-tight">
            Eng mashhur <span className="text-primary italic">fanlar</span>
          </h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto font-medium">
            O'z sohangizni tanlang va profesional mentorlardan bilim oling.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-80 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
            ))
          ) : subjects.map((subject, index) => (
            <motion.div
              key={subject.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full bg-[#111827] rounded-[2.5rem] border border-white/5 p-8 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden flex flex-col items-start">

                {/* Icon & XP */}
                <div className="flex justify-between items-start w-full mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300 border border-primary/20">
                    <DynamicIcon name={subject.icon} className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-black h-8 px-4 rounded-xl">
                      +{subject.xp_reward || 50} XP
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-primary transition-colors font-cinzel">{subject.name}</h3>
                <p className="text-secondary text-sm font-medium leading-relaxed mb-8 line-clamp-2">
                  {subject.description || "Ushbu fan bo'yicha eng sara kurslar va nufuzli olimpiadalar to'plami."}
                </p>

                {/* Stats */}
                <div className="w-full flex items-center gap-6 mb-8 py-4 border-y border-white/5">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-white">{subject.stats?.students || "1k+"}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">O‘quvchi</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-white">{subject.stats?.olympiads || "5+"}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Olimpiada</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <Link to={`/all-courses?subject=${subject.id}`} className="w-full">
                  <Button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white font-black hover:bg-primary hover:text-background hover:border-primary transition-all active:scale-95 flex items-center justify-center gap-2 group/btn">
                    Kursni boshlash
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>

                {/* Secondary Engagement Link */}
                <Link
                  to={`/all-olympiads?subject=${subject.id}`}
                  className="w-full text-center mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B] hover:text-primary transition-colors"
                >
                  Olimpiadalarni ko'rish
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default SubjectsSection;
