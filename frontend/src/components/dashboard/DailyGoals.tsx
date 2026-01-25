import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";

const goals = [
    {
        id: 1,
        title: "Fizika: 4-darsni tugatish",
        subtitle: "Kuchlar va harakat",
        completed: false,
        type: "lesson",
        priority: "high"
    },
    {
        id: 2,
        title: "Algebra: Test topshirish",
        subtitle: "Kvadrat tenglamalar",
        completed: false,
        type: "test",
        priority: "medium"
    },
    {
        id: 3,
        title: "Olimpiadaga ro'yxatdan o'tish",
        subtitle: "Matematika Respublika bosqichi",
        completed: true,
        type: "olympiad",
        priority: "medium"
    }
];

const DailyGoals = () => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        🎯 Bugungi maqsadlar
                    </h2>
                    <p className="text-sm text-gray-500">Bugungi rejangiz: 3 ta vazifa</p>
                </div>
                <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    1/3 bajarildi
                </div>
            </div>

            <div className="space-y-3">
                {goals.map((goal) => (
                    <div key={goal.id} className={`group flex items-center p-3 rounded-2xl transition-all ${goal.completed ? 'bg-green-50/50' : 'bg-gray-50 hover:bg-blue-50/50'}`}>
                        <button className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${goal.completed ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 group-hover:border-blue-400'}`}>
                            {goal.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-transparent" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-sm truncate ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                {goal.title}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">{goal.subtitle}</p>
                        </div>

                        {!goal.completed && (
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-100">
                                Bajarish <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyGoals;
