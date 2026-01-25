import { Button } from "@/components/ui/button";
import { Play, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const courses = [
    {
        id: 1,
        title: "Murakkab Algebra: III qism",
        progress: 32,
        lastSeen: "6 kun oldin",
        status: "warning", // active, warning, completed
        tag: "Tashlab ketilayapti ⚠️",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Kuchlar va harakat",
        progress: 75,
        lastSeen: "Kecha",
        status: "active",
        tag: "Tavsiya etiladi 🔥",
        image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=200&auto=format&fit=crop"
    }
];

const SmartCourseList = () => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">📚 Mening Kurslarim</h2>
                <Link to="/courses" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Hammasi</Link>
            </div>

            <div className="space-y-4 flex-1">
                {courses.map((course) => (
                    <div key={course.id} className="group flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                                {course.tag && (
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1 ${course.status === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {course.tag}
                                    </span>
                                )}
                                <h3 className="font-bold text-gray-900 text-sm truncate leading-tight">{course.title}</h3>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {course.lastSeen}
                                </div>
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                                    <div className={`h-full rounded-full ${course.status === 'warning' ? 'bg-orange-500' : 'bg-blue-600'}`} style={{ width: `${course.progress}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Button size="icon" className={`rounded-full w-10 h-10 shadow-md ${course.status === 'warning' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                <Play className="w-4 h-4 ml-0.5 fill-white" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartCourseList;
