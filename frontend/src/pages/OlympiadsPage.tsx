import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Search,
  BookOpen,
  AlertTriangle,
  PlayCircle,
  FileText,
  CheckCircle2,
  Hourglass,
  ArrowRight
} from "lucide-react";

// Rich Mock Data
const olympiads = [
  {
    id: 1,
    title: "Matematika Respublika Olimpiadasi",
    subject: "Matematika",
    date: "20-yanvar",
    time: "10:00",
    duration: "3 soat",
    participants: 847,
    maxParticipants: 1000,
    price: "50,000",
    level: "Pro",
    status: "upcoming", // upcoming, registered, completed
    urgency: "high", // high, medium, low
    details: {
      questions: 30,
      format: "Test + Yozma",
      grade: "7-9 Sinf",
      passingScore: "60%"
    },
    prep: {
      title: "Algebra maxsus kursi",
      courseId: 1
    }
  },
  {
    id: 2,
    title: "Fizika Challenge",
    subject: "Fizika",
    date: "25-yanvar",
    time: "14:00",
    duration: "2 soat",
    participants: 342,
    maxParticipants: 500,
    price: "35,000",
    level: "Intermediate",
    status: "registered",
    urgency: "medium",
    details: {
      questions: 25,
      format: "Online Test",
      grade: "8-11 Sinf",
      passingScore: "50%"
    },
    prep: {
      title: "Mexanika demo testi",
      courseId: 2
    }
  },
  {
    id: 3,
    title: "Informatika Hackathon",
    subject: "Informatika",
    date: "1-fevral",
    time: "09:00",
    duration: "4 soat",
    participants: 521,
    maxParticipants: 600,
    price: "75,000",
    level: "Olympiad",
    status: "upcoming",
    urgency: "low",
    details: {
      questions: 5,
      format: "Kodlash (Algo)",
      grade: "Barcha sinflar",
      passingScore: "40%"
    },
    prep: {
      title: "Python algoritmlari",
      courseId: 3
    }
  },
  {
    id: 6,
    title: "Kimyo Olimpiadasi (Yakunlangan)",
    subject: "Kimyo",
    date: "10-yanvar",
    time: "10:00",
    duration: "2 soat",
    participants: 456,
    maxParticipants: 500,
    price: "40,000",
    level: "Intermediate",
    status: "completed",
    urgency: "low",
    details: {
      questions: 40,
      format: "Test",
      grade: "9-11 Sinf",
      passingScore: "55%"
    },
    prep: null
  },
];

const subjects = ["Barcha fanlar", "Matematika", "Fizika", "Informatika", "Kimyo"];
const statuses = ["Barcha", "Yaqinlashayotgan", "Ro'yxatdan o'tilgan", "Tugallangan"];

const OlympiadsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Barcha fanlar");
  const [selectedStatus, setSelectedStatus] = useState("Barcha");

  const filteredOlympiads = olympiads.filter((o) => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = selectedSubject === "Barcha fanlar" || o.subject === selectedSubject;
    const matchesStatus =
      selectedStatus === "Barcha" ||
      (selectedStatus === "Yaqinlashayotgan" && o.status === "upcoming") ||
      (selectedStatus === "Ro'yxatdan o'tilgan" && o.status === "registered") ||
      (selectedStatus === "Tugallangan" && o.status === "completed");
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const getStatusBadge = (status: string, urgency: string) => {
    if (status === 'registered') return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ro'yxatdan o'tilgan</span>;
    if (status === 'completed') return <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FileText className="w-3 h-3" /> Yakunlangan</span>;
    if (urgency === 'high') return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse"><AlertTriangle className="w-3 h-3" /> Joylar tugayapti</span>;
    return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Hourglass className="w-3 h-3" /> Qabul ochiq</span>;
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in max-w-7xl mx-auto min-h-screen">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Olimpiadalar</h1>
          <p className="text-gray-500">Katta marralar sari birinchi qadamni tashlang</p>
        </div>

        {/* Simple Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white outline-none"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOlympiads.map((olympiad) => (
          <div key={olympiad.id} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden group">

            {/* Header (Gradient) */}
            <div className={`p-6 pb-8 relative ${olympiad.status === 'completed' ? 'bg-gray-100' : 'bg-gradient-to-br from-gray-900 to-gray-800'}`}>
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {getStatusBadge(olympiad.status, olympiad.urgency)}
              </div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg ${olympiad.status === 'completed' ? 'bg-white text-gray-400' : 'bg-white/10 backdrop-blur text-white'}`}>
                <Trophy className="w-6 h-6" />
              </div>

              <h3 className={`text-xl font-bold mb-1 leading-tight ${olympiad.status === 'completed' ? 'text-gray-500' : 'text-white'}`}>
                {olympiad.title}
              </h3>

              {/* Timeline / Urgency */}
              {olympiad.status === 'upcoming' && (
                <div className="flex items-center gap-2 mt-4 text-orange-300 text-sm font-bold bg-orange-400/10 inline-flex px-3 py-1 rounded-lg border border-orange-400/20">
                  <Clock className="w-4 h-4" />
                  {olympiad.urgency === 'high' ? 'Bugun yopiladi!' : '3 kun qoldi'}
                </div>
              )}
            </div>

            {/* Details Grid (Trust Builders) */}
            <div className="px-6 -mt-4 relative z-10">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Format</span>
                  <span className="text-sm font-bold text-gray-800">{olympiad.details.format}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Savollar</span>
                  <span className="text-sm font-bold text-gray-800">{olympiad.details.questions} ta</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Sinf</span>
                  <span className="text-sm font-bold text-gray-800">{olympiad.details.grade}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">O'tish bali</span>
                  <span className="text-sm font-bold text-green-600">{olympiad.details.passingScore}</span>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {olympiad.date}, {olympiad.time}
                </div>
                <div className="font-bold text-blue-600">{olympiad.price === 'Bepul' ? 'Bepul' : `${olympiad.price} so'm`}</div>
              </div>

              {/* Prep Block (Cross-sell) */}
              {olympiad.prep && olympiad.status !== 'completed' && (
                <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 flex items-center justify-between group/prep hover:bg-blue-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-blue-400">Tayyorgarlik</span>
                      <span className="text-xs font-bold text-gray-700">{olympiad.prep.title}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-300 group-hover/prep:text-blue-500 -ml-2" />
                </div>
              )}

              <div className="mt-auto pt-2">
                {olympiad.status === 'registered' ? (
                  <Link to={`/olympiad/${olympiad.id}`}>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 rounded-xl">
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Kabinetga kirish
                    </Button>
                  </Link>
                ) : olympiad.status === 'completed' ? (
                  <Button variant="outline" className="w-full h-12 rounded-xl text-gray-400" disabled>
                    Yakunlangan
                  </Button>
                ) : (
                  <Link to={`/olympiad/${olympiad.id}`}>
                    <Button className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-gray-200 hover:shadow-blue-200 transition-all">
                      Qatnashish
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OlympiadsPage;
