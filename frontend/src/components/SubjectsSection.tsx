import { Calculator, Atom, Code, Brain, BookOpen, Globe, Trophy, Users, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";

const subjects = [
  {
    icon: Calculator,
    name: "Matematika",
    desc: "Olimpiada va maktab uchun chuqur tayyorgarlik",
    stats: { students: "3.2k", courses: 45, olympiads: 12 },
    color: "bg-blue-600",
    lightColor: "bg-blue-50 text-blue-600",
    badges: ["olympiad", "popular"],
    xp: 100
  },
  {
    icon: Code,
    name: "Informatika",
    desc: "Python, C++ va IT kasblarni noldan o'rganing",
    stats: { students: "2.8k", courses: 52, olympiads: 8 },
    color: "bg-green-600",
    lightColor: "bg-green-50 text-green-600",
    badges: ["skill", "free"],
    xp: 120
  },
  {
    icon: Atom,
    name: "Fizika",
    desc: "Tabiat qonunlarini tajribalar orqali tushuning",
    stats: { students: "2.1k", courses: 38, olympiads: 6 },
    color: "bg-purple-600",
    lightColor: "bg-purple-50 text-purple-600",
    badges: ["olympiad"],
    xp: 110
  },
  {
    icon: Brain,
    name: "Mantiq",
    desc: "Kritik fikrlash va IQ darajasini oshiring",
    stats: { students: "1.5k", courses: 28, olympiads: 4 },
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50 text-yellow-600",
    badges: ["brain"],
    xp: 90
  },
  {
    icon: Globe,
    name: "Ingliz tili",
    desc: "IELTS va CEFR uchun maxsus kurslar",
    stats: { students: "2.4k", courses: 40, olympiads: 5 },
    color: "bg-red-500",
    lightColor: "bg-red-50 text-red-600",
    badges: ["popular"],
    xp: 80
  },
  {
    icon: BookOpen,
    name: "Ona tili",
    desc: "Grammatika va adabiyotni mukammal biling",
    stats: { students: "1.9k", courses: 32, olympiads: 3 },
    color: "bg-teal-500",
    lightColor: "bg-teal-50 text-teal-600",
    badges: [],
    xp: 80
  },
];

const getBadgeContent = (badge: string) => {
  switch (badge) {
    case 'olympiad': return { icon: <Trophy className="w-3 h-3" />, text: "Olimpiada" };
    case 'popular': return { icon: <Zap className="w-3 h-3" />, text: "Mashhur" };
    case 'free': return { icon: <Award className="w-3 h-3" />, text: "Bepul darslar" };
    case 'skill': return { icon: <Code className="w-3 h-3" />, text: "IT Kasb" };
    default: return null;
  }
};

const SubjectsSection = () => {
  return (
    <section id="subjects" className="py-16 md:py-24 relative bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4 uppercase tracking-wider">
            Yo'nalishlar
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            Kelajagingizni <span className="text-blue-600">tanalang</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Qaysi fan sizga ko'proq yoqadi? O'zingizga mos yo'nalishni tanlab, birinchi qadamni tashlang.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <Link to="/all-courses" key={subject.name}>
              <div
                className="group bg-white rounded-3xl border border-gray-100 p-6 md:p-8 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full flex flex-col"
              >
                {/* Decoration Circle */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${subject.color}`} />

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <subject.icon className="w-8 h-8 text-white" />
                  </div>
                  {/* XP Badge */}
                  <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    +{subject.xp} XP
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-gray-500 mb-6 line-clamp-2 text-sm">
                  {subject.desc}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {subject.badges.map(b => {
                    const badge = getBadgeContent(b);
                    if (!badge) return null;
                    return (
                      <span key={b} className={`${subject.lightColor} px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5`}>
                        {badge.icon} {badge.text}
                      </span>
                    )
                  })}
                </div>

                {/* Stats Footer */}
                <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900">{subject.stats.students}</span>
                    <span className="text-xs font-medium text-gray-400 uppercase">O'quvchi</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900">{subject.stats.olympiads}</span>
                    <span className="text-xs font-medium text-gray-400 uppercase">Olimpiada</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
