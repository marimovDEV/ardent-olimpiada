import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    PlayCircle,
    Clock,
    BarChart,
    AlertTriangle,
    Flame,
    Zap,
    Trophy,
    BookOpen,
    Plus,
    ArrowRight
} from "lucide-react";

// Enhanced Mock Data
const myCourses = [
    {
        id: 1,
        title: "Kuchlar va harakat asoslari",
        subject: "Fizika",
        progress: 75,
        totalLessons: 24,
        completedLessons: 18,
        remainingTime: "45 daqiqa",
        image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1000&auto=format&fit=crop",
        lastAccessedDays: 0, // Today
        priority: 'main', // Hero course
        theme: 'blue'
    },
    {
        id: 2,
        title: "Murakkab Algebra: III qism",
        subject: "Matematika",
        progress: 32,
        totalLessons: 40,
        completedLessons: 12,
        remainingTime: "12 soat",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
        lastAccessedDays: 1, // Yesterday
        priority: 'olympiad',
        theme: 'purple'
    },
    {
        id: 5,
        title: "Python dasturlash (Boshlang'ich)",
        subject: "Informatika",
        progress: 10,
        totalLessons: 32,
        completedLessons: 3,
        remainingTime: "28 soat",
        image: "https://images.unsplash.com/photo-1515879490105-fb25f1971d0b?q=80&w=1000&auto=format&fit=crop",
        lastAccessedDays: 6, // At Risk
        priority: 'helper',
        theme: 'green'
    }
];

const MyCoursesPage = () => {
    // Sort courses: Hero first, then At Risk, then others
    const sortedCourses = [...myCourses].sort((a, b) => {
        if (a.priority === 'main') return -1;
        if (b.priority === 'main') return 1;
        if (a.lastAccessedDays > 5 && b.lastAccessedDays <= 5) return -1; // Show At Risk first among normal
        return 0;
    });

    const heroCourse = sortedCourses.find(c => c.priority === 'main');
    const otherCourses = sortedCourses.filter(c => c.priority !== 'main');

    return (
        <div className="p-4 md:p-8 animate-fade-in max-w-7xl mx-auto min-h-screen">

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mening Kurslarim</h1>
                    <p className="text-gray-500">Bugungi bilim - kelajak poydevori</p>
                </div>
            </div>

            {/* HERO BLOCK: Continue Now */}
            {heroCourse && (
                <div className="mb-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-1 shadow-2xl shadow-blue-200">
                    <div className="bg-white/10 backdrop-blur-sm rounded-[1.4rem] p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                        {/* Blob Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                        {/* Content */}
                        <div className="flex-1 relative z-10 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                                    Hozir davom et
                                </span>
                                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">
                                    Qoldi: {heroCourse.remainingTime}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{heroCourse.title}</h2>

                            <div className="flex items-center gap-6 mb-8 text-blue-100">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    <span className="font-medium">{heroCourse.completedLessons} / {heroCourse.totalLessons} dars</span>
                                </div>
                                <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${heroCourse.progress}%` }} />
                                </div>
                                <span className="font-bold">{heroCourse.progress}%</span>
                            </div>

                            <Link to={`/course/${heroCourse.id}`}>
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-bold h-12 px-8 rounded-xl shadow-lg shadow-black/10">
                                    <PlayCircle className="w-5 h-5 mr-2" />
                                    Darsni boshlash
                                </Button>
                            </Link>
                        </div>

                        {/* Image */}
                        <div className="w-full md:w-80 h-48 md:h-56 rounded-2xl overflow-hidden relative shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
                            <img src={heroCourse.image} alt={heroCourse.title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            )}

            {/* Other Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {otherCourses.map((course) => {
                    const isAtRisk = course.lastAccessedDays > 5;
                    const isOlympiad = course.priority === 'olympiad';

                    return (
                        <div key={course.id} className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border ${isAtRisk ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'}`}>
                            {/* Tags */}
                            <div className="h-40 relative overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isAtRisk ? 'grayscale-[0.3]' : ''}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                <div className="absolute top-3 left-3 flex flex-col gap-1">
                                    {isAtRisk && (
                                        <div className="bg-orange-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm animate-pulse-soft">
                                            <AlertTriangle className="w-3 h-3" /> Diqqat talab
                                        </div>
                                    )}
                                    {isOlympiad && (
                                        <div className="bg-yellow-400/90 backdrop-blur text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                            <Trophy className="w-3 h-3 fill-current" /> Olimpiada
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide flex justify-between">
                                    {course.subject}
                                    <span className={isAtRisk ? 'text-orange-500 font-bold' : 'text-gray-400'}>
                                        {course.lastAccessedDays === 0 ? 'Bugun' : course.lastAccessedDays === 1 ? 'Kecha' : `${course.lastAccessedDays} kun oldin`}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-4 line-clamp-2 leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="font-medium text-gray-600">{course.remainingTime} qoldi</span>
                                        <span className="font-bold text-gray-900">{course.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${isAtRisk ? 'bg-orange-400' : 'bg-green-500'}`} style={{ width: `${course.progress}%` }} />
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        {course.completedLessons}/{course.totalLessons} dars tugatildi
                                    </div>
                                </div>

                                <Link to={`/course/${course.id}`}>
                                    <Button variant="outline" className={`w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all font-medium ${isAtRisk ? 'border-orange-200 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500' : ''}`}>
                                        {isAtRisk ? 'Qayta boshlash' : 'Davom etish'}
                                        <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Course Card (De-emphasized) */}
                <Link to="/courses" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group cursor-pointer h-full min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Yangi kurs qo'shish</h3>
                    <p className="text-sm text-center text-gray-500 px-4">Yangi bilimlar orttirish uchun kutubxonaga o'ting</p>
                </Link>
            </div>
        </div>
    );
};

export default MyCoursesPage;
