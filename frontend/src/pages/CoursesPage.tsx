import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  Play,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Zap,
  Flame,
  Trophy,
  Filter
} from "lucide-react";

// Enhanced Mock Data
const allCourses = [
  {
    id: 1,
    title: "Matematika asoslari",
    subject: "Matematika",
    level: "Beginner",
    lessons: 24,
    duration: "6 soat",
    students: 1245,
    rating: 4.8,
    reviewCount: 120,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop",
    theme: "blue",
    price: "Bepul",
    salesPitch: "Matematikani 0 dan o'rganish uchun ideal",
    tags: ["popular", "recommended"],
    freeLessons: 24
  },
  {
    id: 2,
    title: "Olimpiada matematikasi: 1-bosqich",
    subject: "Matematika",
    level: "Olympiad",
    lessons: 40,
    duration: "12 soat",
    students: 345,
    rating: 4.9,
    reviewCount: 85,
    image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=600&auto=format&fit=crop",
    theme: "blue",
    price: "150,000 so'm",
    salesPitch: "Haqiqiy olimpiada savollari tahlili",
    tags: ["olympiad"],
    freeLessons: 2 // Try for free
  },
  {
    id: 3,
    title: "Python dasturlash: Boshlang'ich",
    subject: "Informatika",
    level: "Beginner",
    lessons: 32,
    duration: "10 soat",
    students: 2100,
    rating: 4.9,
    reviewCount: 340,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    theme: "green",
    price: "Bepul",
    salesPitch: "Eng talabgir dasturlash tili",
    tags: ["popular"],
    freeLessons: 32
  },
  {
    id: 4,
    title: "Fizika: Mexanika qonunlari",
    subject: "Fizika",
    level: "Intermediate",
    lessons: 18,
    duration: "5 soat",
    students: 756,
    rating: 4.7,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop",
    theme: "purple",
    price: "45,000 so'm",
    salesPitch: "Nyuton qonunlarini sodda tilda tushuning",
    tags: [],
    freeLessons: 1
  },
  {
    id: 5,
    title: "IELTS Speaking Masterclass",
    subject: "Ingliz tili",
    level: "Advanced",
    lessons: 15,
    duration: "4 soat",
    students: 560,
    rating: 4.8,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop",
    theme: "pink",
    price: "80,000 so'm",
    salesPitch: "Speakingdan yuqori ball olish sirlari",
    tags: ["recommended"],
    freeLessons: 1
  },
  {
    id: 6,
    title: "Mantiqiy fikrlash (IQ)",
    subject: "Mantiq",
    level: "All Levels",
    lessons: 20,
    duration: "5 soat",
    students: 900,
    rating: 4.6,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1555445054-8488814d38ba?q=80&w=600&auto=format&fit=crop",
    theme: "orange",
    price: "35,000 so'm",
    salesPitch: "Miya faoliyatini rivojlantiring",
    tags: [],
    freeLessons: 2
  }
];

const subjects = ["Barcha fanlar", "Matematika", "Fizika", "Informatika", "Ingliz tili", "Mantiq"];
const levels = ["Barcha darajalar", "Beginner", "Intermediate", "Olympiad", "Advanced"];

const CoursesPage = () => {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Barcha fanlar");
  const [selectedLevel, setSelectedLevel] = useState("Barcha darajalar");
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === "Barcha fanlar" || course.subject === selectedSubject;
    const matchesLevel = selectedLevel === "Barcha darajalar" || course.level === selectedLevel;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-emerald-600';
      case 'purple': return 'bg-violet-600';
      case 'pink': return 'bg-pink-600';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-blue-600';
    }
  };

  const getBadgeContent = (tag: string) => {
    if (tag === 'popular') return { icon: <Flame className="w-3 h-3" />, text: "Eng ommabop", color: "bg-red-500" };
    if (tag === 'recommended') return { icon: <Zap className="w-3 h-3" />, text: "Senga mos", color: "bg-blue-500" };
    if (tag === 'olympiad') return { icon: <Trophy className="w-3 h-3" />, text: "Olimpiada", color: "bg-yellow-500" };
    return null;
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in max-w-7xl mx-auto min-h-screen">

      {/* Search & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Barcha Kurslar</h1>
          <p className="text-gray-500">O'zingizga mos kursni toping va o'rganishni boshlang</p>
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters (Mobile Collapsible) */}
      <div className={`flex flex-wrap gap-2 mb-8 ${showFilters ? 'block' : 'hidden md:flex'}`}>
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubject === subject ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <Link key={course.id} to={`/course/${course.id}`} className="group bg-white rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">

            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
              {course.tags.map(tag => {
                const badge = getBadgeContent(tag);
                if (!badge) return null;
                return (
                  <span key={tag} className={`${badge.color} text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
                    {badge.icon} {badge.text}
                  </span>
                )
              })}
            </div>

            {/* Cover Image */}
            <div className="h-48 relative overflow-hidden bg-gray-100">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Level Badge */}
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">
                {course.level}
              </div>

              {/* Progress Bar (if applicable) */}
              <div className={`absolute bottom-0 left-0 h-1 ${getThemeColor(course.theme)}`} style={{ width: '40%' }}></div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${course.theme === 'blue' ? 'text-blue-600' : course.theme === 'green' ? 'text-emerald-600' : course.theme === 'purple' ? 'text-violet-600' : 'text-gray-600'}`}>
                  {course.subject}
                </span>
                <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  {course.rating} <span className="text-gray-400 font-normal">({course.reviewCount})</span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>

              <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                {course.salesPitch}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className={`font-bold text-lg ${course.price === 'Bepul' ? 'text-green-600' : 'text-gray-900'}`}>{course.price}</span>
                  {course.price !== 'Bepul' && course.freeLessons > 0 && (
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                      🎁 {course.freeLessons} dars bepul
                    </span>
                  )}
                </div>
                <Button size="icon" className={`rounded-full shadow-none ${course.price === 'Bepul' ? 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white' : 'bg-gray-100 text-gray-900 hover:bg-blue-600 hover:text-white'}`}>
                  <Play className="w-4 h-4 ml-0.5" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
