import { useState, useEffect } from "react";
import { homepageService, Mentor } from "@/services/homepageService";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Search,
    Sparkles,
    ArrowRight,
    Instagram,
    Linkedin,
    Github,
    GraduationCap,
    CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PublicTeachersPage = () => {
    const { t, i18n } = useTranslation();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchMentors = async () => {
            setIsLoading(true);
            try {
                const data = await homepageService.getMentors();
                const lang = i18n.language === 'ru' ? 'ru' : 'uz';
                const mapped = data.map((item: any) => {
                    const baseUrl = 'https://test.api.ardentsoft.uz';
                    const imageUrl = item.image?.startsWith('http') ? item.image : `${baseUrl}${item.image}`;
                    return {
                        id: item.id,
                        name: item.name,
                        role: item.position,
                        experience: item.experience,
                        image: imageUrl,
                        company: item.company,
                        bio: item[`bio_${lang}`] || item.bio_uz,
                        socials: item.social_links || {}
                    };
                });
                setTeachers(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMentors();
    }, [i18n.language]);

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        teacher.role.toLowerCase().includes(search.toLowerCase()) ||
        teacher.company.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen pb-20 pt-32">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Badge variant="outline" className="px-6 py-1.5 text-sm border-primary/30 text-primary bg-primary/5 backdrop-blur-sm font-bold uppercase tracking-widest">
                            <Sparkles className="w-4 h-4 mr-2" />
                            {t('teachers.badge', "Kuchli Jamoa")}
                        </Badge>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-cinzel">
                        Bizning <span className="text-primary italic">Mentorlarimiz</span>
                    </h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto font-medium">
                        O'z sohasining haqiqiy professionallaridan bilim oling va maqsadlaringizga tezroq erishing.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-16 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Mentorlarni qidirish..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-[#111827]/50 border border-white/10 text-white placeholder:text-secondary focus:outline-none focus:border-primary/50 transition-all font-bold backdrop-blur-md"
                    />
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : filteredTeachers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTeachers.map((teacher, index) => (
                            <motion.div
                                key={teacher.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-[#111827]/40 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 flex flex-col hover:shadow-2xl hover:shadow-primary/5"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(teacher.name) + '&size=600&background=FACC15&color=0B0F1A';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-90" />

                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <h3 className="text-2xl font-black mb-1 group-hover:text-primary transition-colors font-cinzel tracking-tight">{teacher.name}</h3>
                                        <p className="text-sm text-primary/80 font-bold uppercase tracking-widest">{teacher.role}</p>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <Badge variant="secondary" className="bg-white/5 text-secondary border-0 font-bold">
                                            {teacher.company}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> {teacher.experience} yil tajriba
                                        </Badge>
                                    </div>

                                    <p className="text-secondary text-sm line-clamp-3 mb-8 font-medium italic">
                                        "{teacher.bio || "Kelajak bunyodkorlariga bilim ulashish yo'lida."}"
                                    </p>

                                    <div className="mt-auto grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            {teacher.socials.instagram && (
                                                <a href={teacher.socials.instagram} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-all">
                                                    <Instagram className="w-5 h-5" />
                                                </a>
                                            )}
                                            {teacher.socials.linkedin && (
                                                <a href={teacher.socials.linkedin} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-background transition-all">
                                                    <Linkedin className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                        <Link to={`/teacher-profile/${teacher.id}`}>
                                            <Button className="w-full rounded-xl font-black gap-2 group/btn shadow-lg shadow-primary/10">
                                                Profil <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5">
                        <GraduationCap className="w-16 h-16 text-secondary mx-auto mb-6 opacity-20" />
                        <h3 className="text-2xl font-black text-white">{search ? "Mentor topilmadi" : "Hozircha mentorlar yo'q"}</h3>
                        <p className="text-secondary mt-2">Tez orada yangi mentorlar qo'shiladi.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default PublicTeachersPage;
