import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Star } from "lucide-react";

const winners = [
    { id: 1, name: "Azizbek Toxirov", subject: "Matematika", result: "1-o'rin", prize: "MacBook Air", location: "Toshkent", image: "/images/winners_group.png" },
    { id: 2, name: "Malika Karimova", subject: "Fizika", result: "2-o'rin", prize: "iPhone 15", location: "Samarqand", image: null },
    { id: 3, name: "Jamshid Aliyev", subject: "Informatika", result: "1-o'rin", prize: "MacBook Pro", location: "Buxoro", image: null },
    { id: 4, name: "Sevara Tursunova", subject: "Ingliz tili", result: "3-o'rin", prize: "Informatika", location: "Namangan", image: null },
];

const PublicWinnersPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-16 container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
                        Hall of Fame
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        Olimpiada G'oliblari
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Bizning faxrimiz bo'lgan o'quvchilar. Ular o'z bilimlari bilan yuqori natijalarni qayd etishdi.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {winners.map((winner) => (
                        <div key={winner.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                            <div className="h-48 bg-muted relative">
                                {winner.image ? (
                                    <img src={winner.image} alt={winner.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                                        <Award className="w-12 h-12 text-secondary" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                                    {winner.result}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1">{winner.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{winner.location}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                                        <span className="text-sm font-medium">Fan</span>
                                        <span className="text-sm text-primary font-bold">{winner.subject}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-warning/10 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-warning" />
                                            <span className="text-sm font-medium">Sovg'a</span>
                                        </div>
                                        <span className="text-sm text-foreground font-bold">{winner.prize}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PublicWinnersPage;
