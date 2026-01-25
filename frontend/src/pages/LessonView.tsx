import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    ChevronRight,
    ChevronLeft,
    FileText,
    Play,
    CheckCircle2,
    Download,
    MessageSquare
} from "lucide-react";

// Mock data for a single lesson
const mockLessonData = {
    id: 5,
    title: "Ratsional sonlar",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=AdJdcq8F8pP9s_", // Mock URL
    description: "Bu darsda biz ratsional sonlar, ularning xossalari va ular ustida amallar bajarishni o'rganamiz.",
    resources: [
        { title: "Dars konspekti", type: "pdf", size: "1.2 MB" },
        { title: "Uyga vazifa", type: "pdf", size: "0.5 MB" }
    ],
    nextLessonId: 6,
    prevLessonId: 4,
    isCompleted: false,
};

const LessonView = () => {
    const { id, lessonId } = useParams(); // Course ID and Lesson ID
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link
                        to={`/course/${id}`}
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-sm lg:text-base line-clamp-1">
                            {mockLessonData.title}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Matematika asoslari / 2-modul / 5-dars
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={!mockLessonData.prevLessonId}>
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Oldingi
                        </Button>
                        <Button variant="outline" size="sm" disabled={!mockLessonData.nextLessonId}>
                            Keyingi
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                    <Button variant="default" size="sm" className={mockLessonData.isCompleted ? "bg-success hover:bg-success/90" : ""}>
                        {mockLessonData.isCompleted ? <CheckCircle2 className="w-4 h-4 mr-2" /> : null}
                        {mockLessonData.isCompleted ? "Tugatildi" : "Tugatdim"}
                    </Button>
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 lg:px-8 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content (Video) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-strong">
                            <iframe
                                className="w-full h-full"
                                src={mockLessonData.videoUrl}
                                title="Lesson Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="flex items-center gap-4 border-b border-border pb-1">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === "overview" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Umumiy
                                {activeTab === "overview" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab("resources")}
                                className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === "resources" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Materiallar
                                {activeTab === "resources" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab("comments")}
                                className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === "comments" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Savollar
                                {activeTab === "comments" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
                            </button>
                        </div>

                        <div className="min-h-[200px]">
                            {activeTab === "overview" && (
                                <div className="animate-fade-in space-y-4">
                                    <h2 className="text-xl font-bold">Dars haqida</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {mockLessonData.description}
                                    </p>
                                </div>
                            )}

                            {activeTab === "resources" && (
                                <div className="animate-fade-in space-y-3">
                                    {mockLessonData.resources.map((res, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{res.title}</div>
                                                    <div className="text-xs text-muted-foreground uppercase">{res.type} • {res.size}</div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <Download className="w-5 h-5 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "comments" && (
                                <div className="animate-fade-in text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Savolingiz bormi?</h3>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Dars yuzasidan savollaringizni shu yerda qoldiring.
                                    </p>
                                    <Button variant="outline">Izoh qoldirish</Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar (Next Lessons Preview) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
                            <h3 className="font-bold mb-4">Keyingi darslar</h3>
                            <div className="space-y-1">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer opacity-60">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                            0{item + 5}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate">Keyingi mavzu nomi {item}</div>
                                            <div className="text-xs text-muted-foreground">15:00</div>
                                        </div>
                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonView;
