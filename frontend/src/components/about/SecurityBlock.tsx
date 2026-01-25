import { ShieldCheck, Lock, Eye, QrCode } from "lucide-react";

const SecurityBlock = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div className="order-2 lg:order-1">
                        <div className="inline-block px-4 py-1.5 rounded-lg bg-green-100 text-green-700 font-bold text-sm mb-4 uppercase tracking-wider">
                            Xavfsizlik & Halollik
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            100% Halol va Nazorat ostida
                        </h2>
                        <p className="text-lg text-gray-500 mb-8">
                            Bizning tizimda har bir ball haqqoniy bo'lishi shart. Buning uchun eng so'nggi texnologiyalardan foydalanamiz.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <Lock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Loglar va Monitoring</h4>
                                    <p className="text-gray-500 text-sm">Har bir urinish, vaqt va IP manzil yozib boriladi. Shubhali harakatlar avtomatik bloklanadi.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                                    <Eye className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Anti-Cheating Tizimi</h4>
                                    <p className="text-gray-500 text-sm">Savollar har bir o'quvchiga randomizatsiya qilinadi. Tabdan chiqish taqiqlanadi.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                                    <QrCode className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">QR-kodli Sertifikatlar</h4>
                                    <p className="text-gray-500 text-sm">Yutuqlarni soxtalashtirib bo'lmaydi. Istalgan vaqtda QR-kod orqali tekshirish imkoniyati.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 relative">
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl relative z-10 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex items-center justify-center mb-8">
                                <ShieldCheck className="w-32 h-32 text-green-500" />
                            </div>

                            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 mb-4">
                                <div className="flex justify-between text-white text-sm font-mono mb-2">
                                    <span>Status:</span>
                                    <span className="text-green-400">SECURE ✅</span>
                                </div>
                                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-full animate-pulse" />
                                </div>
                            </div>

                            <div className="text-center text-white/60 text-xs font-mono">
                                System ID: 8X-9942 • Encryption: AES-256
                            </div>
                        </div>

                        {/* Decorative BG */}
                        <div className="absolute inset-0 bg-gray-100 rounded-[2.5rem] transform -rotate-3 -z-10 scale-95" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SecurityBlock;
