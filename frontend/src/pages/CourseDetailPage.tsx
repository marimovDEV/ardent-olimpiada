import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import {
  Play,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Trophy,
  ArrowLeft,
} from "lucide-react";

const courseLessons = [
  {
    id: 1,
    module: "Kirish",
    lessons: [
      { id: 1, title: "Kursga kirish", duration: "5:30", completed: true, free: true },
      { id: 2, title: "Asosiy tushunchalar", duration: "12:45", completed: true, free: true },
    ],
  },
  {
    id: 2,
    module: "Asosiy qism",
    lessons: [
      { id: 3, title: "Natural sonlar", duration: "15:20", completed: true, free: false },
      { id: 4, title: "Butun sonlar", duration: "18:10", completed: true, free: false },
      { id: 5, title: "Ratsional sonlar", duration: "20:00", completed: false, free: false },
      { id: 6, title: "Amallar tartibi", duration: "14:30", completed: false, free: false },
    ],
  },
  {
    id: 3,
    module: "Amaliy mashqlar",
    lessons: [
      { id: 7, title: "Test 1 - Asosiy tushunchalar", duration: "30:00", completed: false, free: false, isTest: true },
      { id: 8, title: "Murakkab misollar", duration: "22:15", completed: false, free: false },
      { id: 9, title: "Yakuniy test", duration: "45:00", completed: false, free: false, isTest: true },
    ],
  },
];

const CourseDetailPage = () => {
  const { id } = useParams();
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2]);
  const [activeLesson, setActiveLesson] = useState(5);

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const currentLesson = courseLessons
    .flatMap((m) => m.lessons)
    .find((l) => l.id === activeLesson);

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kurslarga qaytish
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Player */}
            <div className="aspect-video rounded-2xl gradient-primary relative overflow-hidden shadow-strong">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white ml-1" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <h2 className="text-white font-bold text-lg">{currentLesson?.title}</h2>
                <p className="text-white/70 text-sm">Dars {activeLesson} • {currentLesson?.duration}</p>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h1 className="text-2xl font-bold mb-4">Matematika asoslari</h1>
              <p className="text-muted-foreground mb-6">
                Bu kursda matematikaning asosiy tushunchalari va formulalari o'rganiladi.
                Kurs o'quvchilar uchun tushunarli tilda tushuntirilgan va ko'plab amaliy misollar bilan boyitilgan.
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  <span>24 ta dars</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>6 soat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>1,245 o'quvchi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning fill-warning" />
                  <span>4.8 (234 sharh)</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center text-white font-bold text-xl">
                    M
                  </div>
                  <div>
                    <div className="font-semibold">Mirzo Ulug'bek</div>
                    <div className="text-sm text-muted-foreground">Matematika o'qituvchisi • 10 yil tajriba</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Lessons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card sticky top-8">
              <div className="p-5 border-b border-border">
                <h3 className="font-bold text-lg">Kurs tarkibi</h3>
                <p className="text-sm text-muted-foreground">24 dars • 6 soat</p>
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: '45%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">11/24 dars tugatildi</p>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {courseLessons.map((module) => (
                  <div key={module.id} className="border-b border-border last:border-0">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{module.module}</span>
                      {expandedModules.includes(module.id) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {expandedModules.includes(module.id) && (
                      <div className="px-2 pb-2">
                        {module.lessons.map((lesson) => (
                          <Link
                            to={`/course/${id}/lesson/${lesson.id}`}
                            key={lesson.id}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${activeLesson === lesson.id
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted/50"
                              }`}
                          >
                            <div className="flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-success" />
                              ) : lesson.isTest ? (
                                <FileText className="w-5 h-5 text-warning" />
                              ) : lesson.free ? (
                                <Play className="w-5 h-5" />
                              ) : (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                            </div>
                            {lesson.free && !lesson.completed && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                                Bepul
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-border">
                <Button variant="hero" className="w-full" size="lg">
                  <Trophy className="w-5 h-5" />
                  Davom etish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailPage;
