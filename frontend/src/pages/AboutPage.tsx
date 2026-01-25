import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MissionHero from "@/components/about/MissionHero";
import SecurityBlock from "@/components/about/SecurityBlock";
import TrustSection from "@/components/landing/TrustSection"; // Reusing TrustSection as it fits perfectly
import { Check, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <MissionHero />

                {/* Problem / Solution Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Nega aynan biz?</h2>
                            <p className="text-gray-500 text-lg">Eski muammolarga zamonaviy yechimlar</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-4 py-1 rounded-bl-2xl font-bold text-xs uppercase">Muammo</div>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex gap-3 text-gray-600">
                                        <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                                        <span>Olimpiadalar notekis va nohaq baholanadi</span>
                                    </li>
                                    <li className="flex gap-3 text-gray-600">
                                        <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                                        <span>Tayyorlanish uchun sifatli resurslar kam</span>
                                    </li>
                                    <li className="flex gap-3 text-gray-600">
                                        <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                                        <span>Sertifikatlar ishonchsiz va oson soxtalashtiriladi</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 relative overflow-hidden transform md:-translate-y-4 md:border-t-4 md:border-t-green-500">
                                <div className="absolute top-0 right-0 bg-green-100 text-green-700 px-4 py-1 rounded-bl-2xl font-bold text-xs uppercase">Bizning Yechim</div>
                                <ul className="space-y-4 pt-4">
                                    <li className="flex gap-3 text-gray-900 font-medium">
                                        <div className="bg-green-100 rounded-full p-1"><Check className="w-4 h-4 text-green-600" /></div>
                                        <span>Online, shaffof va avtomatlashgan tizim</span>
                                    </li>
                                    <li className="flex gap-3 text-gray-900 font-medium">
                                        <div className="bg-green-100 rounded-full p-1"><Check className="w-4 h-4 text-green-600" /></div>
                                        <span>Xalqaro toifadagi ustozlardan video darslar</span>
                                    </li>
                                    <li className="flex gap-3 text-gray-900 font-medium">
                                        <div className="bg-green-100 rounded-full p-1"><Check className="w-4 h-4 text-green-600" /></div>
                                        <span>QR-kod orqali 100% tekshiriladigan sertifikatlar</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <TrustSection />
                <SecurityBlock />

                {/* Final CTA */}
                <section className="py-24 bg-blue-900 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Navbat senda!</h2>
                        <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                            Minglab o'quvchilar allaqachon o'z kelajagini qurishni boshladi.
                            Sen nimanidir kutyapsanmi?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/auth">
                                <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-black text-lg">
                                    Bepul ro'yxatdan o'tish
                                </Button>
                            </Link>
                            <Link to="/all-olympiads">
                                <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-blue-400 text-blue-100 hover:bg-blue-800 hover:text-white font-bold text-lg">
                                    Olimpiadalarni ko'rish
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
