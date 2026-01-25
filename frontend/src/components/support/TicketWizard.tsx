import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Trophy,
    CreditCard,
    Wifi,
    HelpCircle,
    ChevronRight
} from "lucide-react";

interface TicketWizardProps {
    onSelectTopic: (topic: string) => void;
}

const topics = [
    { id: 'course', label: 'Kurs bo\'yicha', icon: <BookOpen className="w-5 h-5 text-blue-500" />, desc: "Darslar, videolar, testlar" },
    { id: 'olympiad', label: 'Olimpiada', icon: <Trophy className="w-5 h-5 text-yellow-500" />, desc: "Ro'yxatdan o'tish, natijalar" },
    { id: 'payment', label: 'To\'lov', icon: <CreditCard className="w-5 h-5 text-green-500" />, desc: "Click, Payme, tariflar" },
    { id: 'tech', label: 'Texnik muammo', icon: <Wifi className="w-5 h-5 text-red-500" />, desc: "Sayt ishlamayapti, xatolik" },
    { id: 'other', label: 'Boshqa savol', icon: <HelpCircle className="w-5 h-5 text-gray-500" />, desc: "Umumiy murojaat" },
];

const TicketWizard = ({ onSelectTopic }: TicketWizardProps) => {
    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Yordam burchagi</h3>
                <p className="text-sm text-gray-500">Savolingiz qaysi mavzuda?</p>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1">
                {topics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic.id)}
                        className="w-full bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all p-3 rounded-xl flex items-center gap-4 group text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                            {topic.icon}
                        </div>
                        <div className="flex-1">
                            <span className="font-bold text-gray-900 block text-sm group-hover:text-blue-600 transition-colors">{topic.label}</span>
                            <span className="text-xs text-gray-400 block">{topic.desc}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>

            <div className="mt-auto pt-4 text-center">
                <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                    Javob berish vaqti: ~15 daqiqa
                </p>
            </div>
        </div>
    );
};

export default TicketWizard;
