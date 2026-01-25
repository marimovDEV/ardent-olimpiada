import { ShieldCheck, Users, Building2, CheckCircle2 } from "lucide-react";

// Mock Avatars
const teachers = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
];

const TrustSection = () => {
    return (
        <section className="py-16 bg-gray-50 border-y border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Stats & Text */}
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">
                            O'zbekistondagi eng ishonchli ta'lim hamjamiyati
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Biz nafaqat test olamiz, balki sizning xavfsizligingiz va natijangizni kafolatlaymiz.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-1">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">QR-kodli Sertifikatlar</h4>
                                    <p className="text-sm text-gray-500">Har bir yutug'ingiz blokcheyn texnologiyasi orqali himoyalangan.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Professional Ustozlar</h4>
                                    <p className="text-sm text-gray-500">Savollar xalqaro toifadagi ekspertlar tomonidan tuziladi.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mt-1">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Hamkor Maktablar</h4>
                                    <p className="text-sm text-gray-500">50 dan ortiq xususiy va davlat maktablari biz bilan hamkor.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Proof */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative">
                        {/* Floating Badges */}
                        <div className="absolute -top-6 -right-6 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-xl shadow-lg rotate-3 z-10 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            100% Halol
                        </div>

                        <div className="text-center mb-8">
                            <div className="flex justify-center -space-x-4 mb-4">
                                {teachers.map((img, i) => (
                                    <img key={i} src={img} alt="Teacher" className="w-14 h-14 rounded-full border-4 border-white object-cover" />
                                ))}
                                <div className="w-14 h-14 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs">
                                    +15
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-600">
                                Bizning jamoa — Xalqaro olimpiada g'oliblari
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-black text-gray-900 mb-1">10,000+</div>
                                <div className="text-xs font-bold text-gray-400 uppercase">O'quvchilar</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-black text-blue-600 mb-1">₽ 500mln</div>
                                <div className="text-xs font-bold text-gray-400 uppercase">Yutuq fondi</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center col-span-2">
                                <div className="text-2xl font-black text-green-600 mb-1">4.9/5</div>
                                <div className="text-xs font-bold text-gray-400 uppercase">Ota-onalar bahosi</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TrustSection;
