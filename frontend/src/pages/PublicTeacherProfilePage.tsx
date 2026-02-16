import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { homepageService, Mentor } from "@/services/homepageService";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    ArrowLeft,
    GraduationCap,
    CheckCircle,
    Play,
    Star,
    Users,
    ArrowRight,
    Instagram,
    Linkedin,
    Github,
    Globe
} from "lucide-react";
import { getSubjectTheme } from "@/lib/course-themes";
import * as Icons from "lucide-react";

const PublicTeacherProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const [mentor, setMentor] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const mentorData = await homepageService.getMentorById(id);
                setMentor(mentorData);

                // Fetch courses for this teacher
                const coursesData = await homepageService.getPublicCourses({ teacher: id });
                setCourses(Array.isArray(coursesData) ? coursesData : coursesData.results || []);
            } catch (err) {
                console.error("Failed to fetch mentor profile:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-black mb-4 font-cinzel">{t('common.error.notFound')}</h1>
                <Link to="/">
                    <Button className="rounded-xl font-bold">Asosiyga qaytish</Button>
                </Link>
            </div>
        );
    }

    const lang = i18n.language === 'ru' ? 'ru' : 'uz';
    const bio = mentor[`bio_${lang}`] || mentor.bio_uz || "";

    return (
        <main className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-[#0B0F1A] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.1),transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-12 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-xs">Orqaga qaytish</span>
                    </Link>

                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-4">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl group-hover:bg-primary/30 transition-all duration-700 opacity-60" />
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-primary/20 shadow-gold">
                                    <img
                                        src={mentor.image?.startsWith('http') ? mentor.image : `https://test.api.ardentsoft.uz${mentor.image}`}
                                        alt={mentor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(mentor.name) + '&size=600&background=FACC15&color=0B0F1A';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            <div className="space-y-4">
                                <Badge variant="outline" className="px-4 py-1 text-sm border-primary/30 text-primary bg-primary/10 font-black uppercase tracking-widest">
                                    <GraduationCap className="w-4 h-4 mr-2" />
                                    Mentor Profile
                                </Badge>
                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight font-cinzel">
                                    {mentor.name}
                                </h1>
                                <p className="text-2xl text-primary font-bold italic">
                                    {mentor.position} @ {mentor.company}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-8 items-center border-y border-white/5 py-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-secondary font-black uppercase tracking-widest">Tajriba</span>
                                    <div className="flex items-center gap-2 text-white">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-2xl font-black">{mentor.experience} yil</span>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-white/10 hidden md:block" />
                                <div className="space-y-1">
                                    <span className="text-[10px] text-secondary font-black uppercase tracking-widest">Talabalar</span>
                                    <div className="flex items-center gap-2 text-white">
                                        <Users className="w-5 h-5 text-primary" />
                                        <span className="text-2xl font-black">10,000+</span>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-white/10 hidden md:block" />
                                <div className="space-y-1">
                                    <span className="text-[10px] text-secondary font-black uppercase tracking-widest">Ijtimoiy tarmoqlar</span>
                                    <div className="flex items-center gap-3">
                                        {mentor.social_links?.instagram && (
                                            <a href={mentor.social_links.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all">
                                                <Instagram className="w-5 h-5" />
                                            </a>
                                        )}
                                        {mentor.social_links?.linkedin && (
                                            <a href={mentor.social_links.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all">
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {mentor.social_links?.github && (
                                            <a href={mentor.social_links.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all">
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About & Courses */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8 space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-black text-white font-cinzel border-l-4 border-primary pl-6">
                                    Biografiya
                                </h2>
                                <div className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                    {bio || "Bu mentor haqida qo'shimcha ma'lumot kiritilmagan."}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h2 className="text-3xl font-black text-white font-cinzel border-l-4 border-primary pl-6 mb-8">
                                    Mentor kurslari
                                </h2>

                                {courses.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {courses.map((course) => {
                                            const theme = getSubjectTheme(course.subject_name || course.subject || "");
                                            const DynamicIcon = (Icons as any)[theme.icon] || Icons.BookOpen;

                                            return (
                                                <div key={course.id} className="group bg-card rounded-[2rem] border border-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                                                    <div className="h-48 relative overflow-hidden">
                                                        <img src={course.thumbnail || theme.fallbackImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20" />
                                                        <DynamicIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/50" />
                                                    </div>
                                                    <div className="p-6 space-y-4 flex-1 flex flex-col">
                                                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{course.title}</h3>
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-black tracking-widest">
                                                            <div className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-primary" /> {course.lessons_count} Dars</div>
                                                            <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {Number(course.rating || 0).toFixed(1)}</div>
                                                        </div>
                                                        <div className="mt-auto flex items-center justify-between">
                                                            <div className="font-black text-lg">{Number(course.price) === 0 ? "TEKIN" : `${Number(course.price).toLocaleString()} AC`}</div>
                                                            <Link to={`/course/${course.id}`}>
                                                                <Button size="sm" className="rounded-xl font-bold gap-2">
                                                                    Kirish <ArrowRight className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center bg-white/5 rounded-[2rem] border border-white/5">
                                        <p className="text-secondary font-bold">Hozircha mentor kurslari topilmadi.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-8 sticky top-32">
                                <h3 className="text-xl font-black text-white font-cinzel tracking-tight">Kafolatlangan ta'lim</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Professional tajriba",
                                        "Amaliy loyihalar",
                                        "Doimiy fikr-mulohaza",
                                        "Sertifikat bilan taqdirlash"
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm font-bold text-secondary">
                                            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-4">
                                    <Link to="/courses">
                                        <Button className="w-full h-14 rounded-2xl bg-primary text-background font-black text-lg shadow-gold hover:scale-[1.02] transition-all">
                                            Barcha kurslar
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PublicTeacherProfilePage;
