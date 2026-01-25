import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Play,
    Star,
    Users,
    ArrowRight,
    Trophy,
    Flame,
    Gift,
    Zap,
    CheckCircle2,
    Filter
} from "lucide-react";
import { Link } from "react-router-dom";

// Rich Mock Data
const courses = [
    {
        id: 1,
        title: "Matematika Asoslari",
        level: "Boshlang'ich",
        grade: "5-6 Sinf",
        outcome: "Maktab dasturini mustahkamlash",
        lessons: 12,
        students: 1200,
        rating: 4.8,
        color: "bg-blue-500",
        tags: ["popular", "free"],
        xp: 50
    },
    {
        id: 2,
        title: "Fizika: Mexanika",
        level: "O'rta",
        grade: "7-9 Sinf",
        outcome: "Olimpiada masalalarini yechish",
        lessons: 18,
        students: 850,
        rating: 4.7,
        color: "bg-green-500",
        tags: ["olympiad"],
        xp: 100
    },
    {
        id: 3,
        title: "Python Dasturlash",
        level: "Boshlang'ich",
        grade: "Barcha uchun",
        outcome: "Ilk o'yin va botlarni yaratish",
        lessons: 24,
        students: 2100,
        rating: 4.9,
        color: "bg-purple-500",
        tags: ["popular", "new"],
        xp: 75
    },
    {
        id: 4,
        title: "Ingliz tili: Grammatika",
        level: "Barcha uchun",
        grade: "5-11 Sinf",
        outcome: "IELTS ga tayyorgarlik",
        lessons: 30,
        students: 3000,
        rating: 4.6,
        color: "bg-orange-500",
        tags: [],
        xp: 50
    },
    {
        id: 5,
        title: "Kimyo: Organik",
        level: "Oliy",
        grade: "10-11 Sinf",
        outcome: "Universitetga kirish",
        lessons: 15,
        students: 500,
        rating: 4.8,
        color: "bg-red-500",
        tags: ["olympiad"],
        xp: 150
    },
    {
        id: 6,
        title: "Biologiya",
        level: "O'rta",
        grade: "8-9 Sinf",
        outcome: "Anatomiya asoslari",
        lessons: 20,
        students: 900,
        rating: 4.5,
        color: "bg-cyan-500",
        tags: ["free"],
        xp: 60
    },
];

const subjects = ["Barcha fanlar", "Matematika", "Fizika", "Informatika", "Ingliz tili", "Kimyo", "Biologiya"];
const grades = ["Barcha sinflar", "5-6 Sinf", "7-9 Sinf", "10-11 Sinf"];

const PublicCoursesPage = () => {
    const [selectedSubject, setSelectedSubject] = useState("Barcha fanlar");
    const [selectedGrade, setSelectedGrade] = useState("Barcha sinflar");
    const [showFilters, setShowFilters] = useState(false);

    const filteredCourses = courses.filter(course => {
        const matchesSubject = selectedSubject === "Barcha fanlar" || course.title.includes(selectedSubject.split(" ")[0]); // Simple matching
        const matchesGrade = selectedGrade === "Barcha sinflar" || course.grade.includes(selectedGrade.split(" ")[0]); // Simple matching
        return matchesSubject && matchesGrade;
    });

    const getBadge = (tag: string) => {
        switch (tag) {
            case 'olympiad': return { icon: <Trophy className="w-3 h-3" />, text: "Olimpiada", color: "bg-yellow-400 text-yellow-900" };
            case 'popular': return { icon: <Flame className="w-3 h-3" />, text: "Mashhur", color: "bg-red-500 text-white" };
            case 'free': return { icon: <Gift className="w-3 h-3" />, text: "Bepul", color: "bg-green-500 text-white" };
            case 'new': return { icon: <Zap className="w-3 h-3" />, text: "Yangi", color: "bg-blue-500 text-white" };
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16 container mx-auto px-4">

                {/* Header Section */}
                <div className="text-center mb-12 animate-slide-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Bilim olishni <span className="text-blue-600">shu yerdan</span> boshlang
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Olimpiadalarga tayyorlaning, maktab baholarini yaxshilang va yangi kasblarni o'rganing.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-20">
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {subjects.map(subject => (
                            <button
                                key={subject}
                                onClick={() => setSelectedSubject(subject)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedSubject === subject
                                        ? "bg-gray-900 text-white shadow-md"
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-48">
                            <select
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                className="w-full h-10 pl-4 pr-8 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium appearance-none outline-none focus:border-blue-500"
                            >
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, index) => (
                        <div
                            key={course.id}
                            className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                        >
                            {/* Card Image */}
                            <div className={`h-52 ${course.color} relative flex items-center justify-center overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                <BookOpen className="w-16 h-16 text-white/40 transform group-hover:scale-110 transition-transform duration-500" />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                                    {course.tags.map(tag => {
                                        const badge = getBadge(tag);
                                        return badge ? (
                                            <span key={tag} className={`${badge.color} px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm flex items-center gap-1`}>
                                                {badge.icon} {badge.text}
                                            </span>
                                        ) : null;
                                    })}
                                </div>

                                <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold border border-white/20">
                                    {course.grade}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="font-bold text-xl leading-tight mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                    <p className="text-sm text-gray-500 flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                        {course.outcome}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-xl">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Play className="w-4 h-4 fill-gray-400" />
                                        {course.lessons} dars
                                    </div>
                                    <div className="w-px h-4 bg-gray-300" />
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        {course.rating}
                                    </div>
                                    <div className="w-px h-4 bg-gray-300" />
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Users className="w-4 h-4" />
                                        {course.students}
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between gap-4">
                                    <div className="text-xs font-bold text-orange-500 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                                        <Zap className="w-3 h-3 fill-orange-500" />
                                        +{course.xp} XP
                                    </div>

                                    <Link to="/auth" className="flex-1">
                                        <Button className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-blue-200">
                                            Boshlash
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PublicCoursesPage;
