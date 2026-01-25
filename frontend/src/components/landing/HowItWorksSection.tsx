import { UserPlus, PlayCircle, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
    {
        icon: <UserPlus className="w-8 h-8 text-blue-600" />,
        title: "1. Ro'yxatdan o'ting",
        desc: "Telefon raqamingiz orqali 1 daqiqada shaxsiy kabinet oching. Bu mutlaqo bepul!",
        color: "bg-blue-100",
        arrow: true
    },
    {
        icon: <PlayCircle className="w-8 h-8 text-indigo-600" />,
        title: "2. Bilim oling",
        desc: "Maxsus video darslarni ko'ring va mavzularni mustahkamlab oling.",
        color: "bg-indigo-100",
        arrow: true
    },
    {
        icon: <Trophy className="w-8 h-8 text-yellow-600" />,
        title: "3. G'olib bo'ling",
        desc: "Olimpiadada qatnashing, reytingda ko'tariling va iPhone yuting!",
        color: "bg-yellow-100",
        arrow: false
    }
];

const HowItWorksSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        Qanday qilib <span className="text-blue-600">g'olib bo'lish</span> mumkin?
                    </h2>
                    <p className="text-lg text-gray-500">
                        Platformadan foydalanish juda oddiy. Uch qadamda maqsadingizga yeting.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center text-center group">
                            <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center mb-6 shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed max-w-xs">{step.desc}</p>

                            {/* Mobile Arrow */}
                            {step.arrow && (
                                <ArrowRight className="w-6 h-6 text-gray-300 mt-6 md:hidden rotate-90" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all">
                        Hozir boshlash 🚀
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
