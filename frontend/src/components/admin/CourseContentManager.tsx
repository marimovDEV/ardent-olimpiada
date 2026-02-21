import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    GripVertical,
    Video,
    FileText,
    CheckSquare,
    Edit2,
    Trash2,
    ChevronDown,
    ChevronUp,
    Play,
    Puzzle,
    Clock,
    X,
    Save,
    MoreVertical
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { API_URL, getAuthHeader } from "@/services/api";
import { useTranslation } from "react-i18next";
import CourseAnalytics from "./CourseAnalytics";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import QuizEditor from "./QuizEditor";


interface Lesson {
    id: number;
    title: string;
    description: string;
    video_url: string;
    pdf_url: string;
    order: number;
    is_free: boolean;
    is_locked: boolean;
    required_lesson: number | null;
    video_duration: number;
}

interface Module {
    id: number;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface CourseContentManagerProps {
    courseId: number;
    onClose: () => void;
}

const CourseContentManager = ({ courseId, onClose }: CourseContentManagerProps) => {
    const { t } = useTranslation();
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<'curriculum' | 'analytics'>('curriculum');

    // UI for adding/editing
    const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
    const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
    const [currentModule, setCurrentModule] = useState<Partial<Module> | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Partial<Lesson> | null>(null);
    const [targetModuleId, setTargetModuleId] = useState<number | null>(null);
    const [isQuizEditorOpen, setIsQuizEditorOpen] = useState(false);
    const [selectedLessonForQuiz, setSelectedLessonForQuiz] = useState<{ id: number, title: string } | null>(null);
    const [draggedItem, setDraggedItem] = useState<{ type: 'module' | 'lesson', id: number, moduleId?: number } | null>(null);

    const handleDragStart = (e: React.DragEvent, type: 'module' | 'lesson', id: number, moduleId?: number) => {
        setDraggedItem({ type, id, moduleId });
        e.dataTransfer.effectAllowed = 'move';
        // Add a class for styling
        const target = e.target as HTMLElement;
        target.classList.add('opacity-50');
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.classList.remove('opacity-50');
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, targetType: 'module' | 'lesson', targetId: number, targetModuleId?: number) => {
        e.preventDefault();
        if (!draggedItem) return;

        if (draggedItem.type === 'lesson' && targetType === 'lesson' && draggedItem.moduleId === targetModuleId) {
            // Reorder lessons within same module
            const module = modules.find(m => m.id === targetModuleId);
            if (!module) return;

            const newLessons = [...module.lessons];
            const draggedIdx = newLessons.findIndex(l => l.id === draggedItem.id);
            const targetIdx = newLessons.findIndex(l => l.id === targetId);

            if (draggedIdx === targetIdx) return;

            const [removed] = newLessons.splice(draggedIdx, 1);
            newLessons.splice(targetIdx, 0, removed);

            const items = newLessons.map((l, i) => ({ id: l.id, order: i + 1 }));

            try {
                await axios.post(`${API_URL}/courses/${courseId}/reorder_lessons/`, { items }, { headers: getAuthHeader() });
                fetchContent();
                toast.success(t('admin.curriculum.reorderSuccess'));
            } catch (error) {
                toast.error(t('admin.curriculum.error'));
            }
        } else if (draggedItem.type === 'module' && targetType === 'module') {
            // Reorder modules
            const newModules = [...modules];
            const draggedIdx = newModules.findIndex(m => m.id === draggedItem.id);
            const targetIdx = newModules.findIndex(m => m.id === targetId);

            if (draggedIdx === targetIdx) return;

            const [removed] = newModules.splice(draggedIdx, 1);
            newModules.splice(targetIdx, 0, removed);

            const items = newModules.map((m, i) => ({ id: m.id, order: i + 1 }));

            try {
                await axios.post(`${API_URL}/courses/${courseId}/reorder_modules/`, { items }, { headers: getAuthHeader() });
                fetchContent();
                toast.success(t('admin.curriculum.reorderSuccess'));
            } catch (error) {
                toast.error(t('admin.curriculum.error'));
            }
        }
    };

    const toggleLessonLock = async (lesson: Lesson) => {
        try {
            await axios.patch(`${API_URL}/lessons/${lesson.id}/`, { is_locked: !lesson.is_locked }, { headers: getAuthHeader() });
            fetchContent();
            toast.success(t('admin.curriculum.lockToggled'));
        } catch (error) {
            toast.error(t('admin.curriculum.error'));
        }
    };

    useEffect(() => {
        fetchContent();
    }, [courseId]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/courses/${courseId}/learning_state/`, { headers: getAuthHeader() });
            setModules(res.data.modules || res.data);
            // Expand first module by default
            if (res.data.length > 0) {
                setExpandedModules([res.data[0].id]);
            }
        } catch (error) {
            toast.error(t('admin.curriculum.error'));
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (id: number) => {
        setExpandedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const handleSaveModule = async () => {
        try {
            if (currentModule?.id) {
                await axios.put(`${API_URL}/modules/${currentModule.id}/`, currentModule, { headers: getAuthHeader() });
                toast.success(t('admin.curriculum.saveSuccess'));
            } else {
                await axios.post(`${API_URL}/modules/`, { ...currentModule, course: courseId, order: modules.length + 1 }, { headers: getAuthHeader() });
                toast.success(t('admin.curriculum.saveSuccess'));
            }
            setIsModuleDialogOpen(false);
            fetchContent();
        } catch (error) {
            toast.error(t('admin.curriculum.error'));
        }
    };

    const handleDeleteModule = async (id: number) => {
        if (!confirm(t('admin.curriculum.confirmDeleteModule'))) return;
        try {
            await axios.delete(`${API_URL}/modules/${id}/`, { headers: getAuthHeader() });
            fetchContent();
            toast.success(t('admin.curriculum.deleteSuccess'));
        } catch (error) {
            toast.error(t('admin.curriculum.error'));
        }
    };

    const handleSaveLesson = async () => {
        try {
            // Convert minutes to seconds if needed, but model says seconds. 
            // User requested minutes in UI.
            const lessonToSave = {
                ...currentLesson,
                video_duration: (currentLesson?.video_duration || 0) * 60 // UI uses minutes
            };

            if (currentLesson?.id) {
                await axios.put(`${API_URL}/lessons/${currentLesson.id}/`, lessonToSave, { headers: getAuthHeader() });
                toast.success(t('admin.curriculum.saveSuccess'));
            } else {
                await axios.post(`${API_URL}/lessons/`, {
                    ...lessonToSave,
                    course: courseId,
                    module: targetModuleId,
                    order: (modules.find(m => m.id === targetModuleId)?.lessons.length || 0) + 1
                }, { headers: getAuthHeader() });
                toast.success(t('admin.curriculum.saveSuccess'));
            }
            setIsLessonDialogOpen(false);
            fetchContent();
        } catch (error) {
            toast.error(t('admin.curriculum.error'));
        }
    };

    const handleDeleteLesson = async (id: number) => {
        if (!confirm(t('admin.curriculum.confirmDeleteLesson'))) return;
        try {
            await axios.delete(`${API_URL}/lessons/${id}/`, { headers: getAuthHeader() });
            fetchContent();
            toast.success(t('admin.curriculum.deleteSuccess'));
        } catch (error) {
            toast.error(t('admin.curriculum.error'));
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-5xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center bg-card p-6 rounded-[2rem] border border-border shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">{t('admin.curriculum.title')}</h2>
                        <p className="text-muted-foreground text-sm">{t('admin.curriculum.subtitle')}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-2xl h-12 px-6" onClick={() => { setCurrentModule({ title: "" }); setIsModuleDialogOpen(true); }}>
                            <Plus className="w-5 h-5 mr-2 text-primary" />
                            {t('admin.curriculum.addModule')}
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 border border-border" onClick={onClose}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1.5 bg-muted/30 rounded-3xl border border-border w-fit mx-auto">
                    <Button
                        variant={activeTab === 'curriculum' ? 'default' : 'ghost'}
                        className={`rounded-2xl h-11 px-8 font-bold transition-all ${activeTab === 'curriculum' ? 'shadow-lg shadow-primary/20' : ''}`}
                        onClick={() => setActiveTab('curriculum')}
                    >
                        {t('admin.curriculum.title')}
                    </Button>
                    <Button
                        variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                        className={`rounded-2xl h-11 px-8 font-bold transition-all ${activeTab === 'analytics' ? 'shadow-lg shadow-primary/20' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        {t('admin.analytics.title') || "Analitika"}
                    </Button>
                </div>

                {activeTab === 'analytics' ? (
                    <CourseAnalytics courseId={courseId} />
                ) : (
                    <>
                        {/* Modules List */}
                        <div className="space-y-6">
                            {modules.map((module, idx) => (
                                <div key={module.id} className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden group">
                                    {/* Module Header */}
                                    <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => toggleModule(module.id)}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl text-foreground">{module.title}</h3>
                                                <p className="text-sm font-medium text-muted-foreground">{t('admin.curriculum.lessonsCount', { count: module.lessons.length })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, 'module', module.id)}
                                                onDragEnd={handleDragEnd}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, 'module', module.id)}
                                                className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center cursor-move hover:bg-muted transition-colors mr-2"
                                            >
                                                <GripVertical className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl border-border p-2">
                                                    <DropdownMenuItem className="rounded-xl h-10 gap-3" onClick={() => { setCurrentModule(module); setIsModuleDialogOpen(true); }}>
                                                        <Edit2 className="w-4 h-4 text-primary" /> {t('admin.curriculum.editModule')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl h-10 gap-3 text-destructive" onClick={() => handleDeleteModule(module.id)}>
                                                        <Trash2 className="w-4 h-4" /> {t('admin.curriculum.deleteModule')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center">
                                                {expandedModules.includes(module.id) ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lessons List (Expanded) */}
                                    {expandedModules.includes(module.id) && (
                                        <div className="px-6 pb-6 pt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            {module.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, 'lesson', lesson.id, module.id)}
                                                    onDragEnd={handleDragEnd}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, 'lesson', lesson.id, module.id)}
                                                    className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all group/lesson"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center cursor-move text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                                                                <GripVertical className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                                            {lesson.is_free ? <Play className="w-4 h-4 text-green-500 fill-green-500" /> : <Video className="w-4 h-4 text-primary" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-foreground">{lesson.title}</span>
                                                                {lesson.is_free && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none scale-75">{t('admin.curriculum.demo')}</Badge>}
                                                                {lesson.is_locked && (
                                                                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-sm" title="Ushbu dars qulflangan">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-black uppercase tracking-tighter mt-0.5">
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t('admin.curriculum.videoDuration', { minutes: (lesson.video_duration / 60).toFixed(0) })}</span>
                                                                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {lesson.pdf_url ? t('admin.curriculum.hasResource') : t('admin.curriculum.noResource')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-9 w-9 rounded-xl transition-all ${lesson.is_locked ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'text-muted-foreground hover:bg-muted'}`}
                                                            onClick={(e) => { e.stopPropagation(); toggleLessonLock(lesson); }}
                                                            title={lesson.is_locked ? "Qulfdan chiqarish" : "Qulflash"}
                                                        >
                                                            {lesson.is_locked ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> :
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
                                                            }
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 text-primary" onClick={() => {
                                                            setCurrentLesson({
                                                                ...lesson,
                                                                video_duration: Math.round(lesson.video_duration / 60) // Show in minutes
                                                            });
                                                            setTargetModuleId(module.id);
                                                            setIsLessonDialogOpen(true);
                                                        }}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 text-destructive" onClick={() => handleDeleteLesson(lesson.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-xl hover:bg-orange-50 text-orange-500"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedLessonForQuiz({ id: lesson.id, title: lesson.title });
                                                                setIsQuizEditorOpen(true);
                                                            }}
                                                            title="Testni tahrirlash"
                                                        >
                                                            <CheckSquare className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 hover:bg-primary/5 hover:border-primary/30 transition-all font-bold group" onClick={() => { setCurrentLesson({ title: "", is_free: false, video_duration: 10 }); setTargetModuleId(module.id); setIsLessonDialogOpen(true); }}>
                                                <Plus className="w-5 h-5 mr-3 text-primary group-hover:scale-125 transition-transform" />
                                                {t('admin.curriculum.addLesson')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {modules.length === 0 && !loading && (
                                <div className="text-center py-20 bg-card rounded-[3rem] border border-dashed border-border">
                                    <Puzzle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-foreground">{t('admin.curriculum.noModules')}</h3>
                                    <p className="text-muted-foreground font-medium mb-8">{t('admin.curriculum.startAdding')}</p>
                                    <Button className="h-14 px-8 rounded-2xl font-black shadow-xl shadow-primary/20" onClick={() => { setCurrentModule({ title: "" }); setIsModuleDialogOpen(true); }}>
                                        <Plus className="w-5 h-5 mr-3" />
                                        {t('admin.curriculum.addFirstModule')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Module Dialog */}
                <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] bg-card border-none shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">{currentModule?.id ? t('admin.curriculum.editModule') : t('admin.curriculum.newModule')}</DialogTitle>
                            <DialogDescription>{t('admin.curriculum.moduleTitlePlaceholder')}</DialogDescription>
                        </DialogHeader>
                        <div className="py-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('admin.curriculum.moduleTitle')}</label>
                                <Input
                                    placeholder={t('admin.curriculum.moduleTitlePlaceholder')}
                                    value={currentModule?.title || ""}
                                    onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                                    className="h-14 rounded-2xl bg-background border-none shadow-inner text-lg font-bold"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="h-12 rounded-2xl font-bold flex-1" onClick={() => setIsModuleDialogOpen(false)}>{t('admin.curriculum.cancel')}</Button>
                            <Button className="h-12 rounded-2xl font-black flex-1 shadow-lg shadow-primary/20" onClick={handleSaveModule}>
                                <Save className="w-4 h-4 mr-2" /> {t('admin.curriculum.save')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Lesson Dialog */}
                <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                    <DialogContent className="sm:max-w-[700px] rounded-[3rem] bg-card border-none shadow-2xl overflow-hidden p-0">
                        <div className="p-8 space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black">{currentLesson?.id ? t('admin.curriculum.editLesson') : t('admin.curriculum.newLesson')}</DialogTitle>
                                <DialogDescription className="text-base font-medium">{t('admin.curriculum.descriptionPlaceholder')}</DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-8 py-2">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">{t('admin.curriculum.lessonTitle')}</label>
                                        <Input
                                            placeholder={t('admin.curriculum.lessonTitlePlaceholder')}
                                            value={currentLesson?.title || ""}
                                            onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                                            className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-bold text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">{t('admin.curriculum.description')}</label>
                                        <Textarea
                                            placeholder={t('admin.curriculum.descriptionPlaceholder')}
                                            rows={4}
                                            value={currentLesson?.description || ""}
                                            onChange={(e) => setCurrentLesson({ ...currentLesson, description: e.target.value })}
                                            className="rounded-[1.25rem] bg-background border-none shadow-inner font-medium resize-none p-4"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">{t('admin.curriculum.videoUrl')}</label>
                                        <Input
                                            placeholder={t('admin.curriculum.videoUrlPlaceholder')}
                                            value={currentLesson?.video_url || ""}
                                            onChange={(e) => setCurrentLesson({ ...currentLesson, video_url: e.target.value })}
                                            className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-mono text-xs"
                                        />
                                    </div>

                                    {currentLesson?.video_url && currentLesson.video_url.includes('youtube') && (
                                        <div className="aspect-video rounded-2xl overflow-hidden bg-muted border border-border mt-2">
                                            <iframe
                                                className="w-full h-full"
                                                src={currentLesson.video_url.replace('watch?v=', 'embed/')}
                                                title="YouTube preview"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">{t('admin.curriculum.duration')} ({t('common.minutes')})</label>
                                            <Input
                                                type="number"
                                                value={currentLesson?.video_duration || 0}
                                                onChange={(e) => setCurrentLesson({ ...currentLesson, video_duration: parseInt(e.target.value) })}
                                                className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">{t('admin.curriculum.isFree')}</label>
                                            <div className="flex items-center gap-3 h-14 px-4 bg-background rounded-[1.25rem] shadow-inner">
                                                <input
                                                    type="checkbox"
                                                    checked={currentLesson?.is_free || false}
                                                    onChange={(e) => setCurrentLesson({ ...currentLesson, is_free: e.target.checked })}
                                                    className="w-5 h-5 rounded-lg border-muted"
                                                />
                                                <span className="font-bold text-foreground">{t('admin.curriculum.demo')}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">{t('admin.lessonLocked') || "Dars qulflangan"}</label>
                                            <div className="flex items-center gap-3 h-14 px-4 bg-background rounded-[1.25rem] shadow-inner">
                                                <input
                                                    type="checkbox"
                                                    checked={currentLesson?.is_locked || false}
                                                    onChange={(e) => setCurrentLesson({ ...currentLesson, is_locked: e.target.checked })}
                                                    className="w-5 h-5 rounded-lg border-muted"
                                                />
                                                <span className="font-bold text-foreground">{t('admin.locked')}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">{t('admin.requiredLesson') || "Talab qilinadigan dars"}</label>
                                            <Select
                                                value={currentLesson?.required_lesson?.toString() || "none"}
                                                onValueChange={(val) => setCurrentLesson({ ...currentLesson, required_lesson: val === "none" ? null : parseInt(val) })}
                                            >
                                                <SelectTrigger className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-bold">
                                                    <SelectValue placeholder={t('admin.selectLesson') || "Darsni tanlang"} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    <SelectItem value="none">{t('admin.noRequirement') || "Talab yo'q"}</SelectItem>
                                                    {modules.flatMap(m => m.lessons)
                                                        .filter(l => l.id !== currentLesson?.id)
                                                        .map(l => (
                                                            <SelectItem key={l.id} value={l.id.toString()}>{l.title}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-muted-foreground uppercase ml-1 tracking-widest">{t('admin.curriculum.resource')}</label>
                                        <Input
                                            placeholder={t('admin.curriculum.videoUrlPlaceholder')}
                                            value={currentLesson?.pdf_url || ""}
                                            onChange={(e) => setCurrentLesson({ ...currentLesson, pdf_url: e.target.value })}
                                            className="h-14 rounded-[1.25rem] bg-background border-none shadow-inner font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-muted/50 p-8 flex gap-4">
                            <Button variant="ghost" className="h-14 flex-1 rounded-2xl font-bold" onClick={() => setIsLessonDialogOpen(false)}>{t('admin.curriculum.cancel')}</Button>
                            <Button className="h-14 flex-[2] rounded-2xl font-black shadow-xl shadow-primary/20" onClick={handleSaveLesson}>
                                <Save className="w-5 h-5 mr-3" /> {t('admin.curriculum.save')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Quiz Editor Dialog */}
                {selectedLessonForQuiz && (
                    <QuizEditor
                        isOpen={isQuizEditorOpen}
                        onClose={() => {
                            setIsQuizEditorOpen(false);
                            setSelectedLessonForQuiz(null);
                        }}
                        lessonId={selectedLessonForQuiz.id}
                        lessonTitle={selectedLessonForQuiz.title}
                    />
                )}
            </div>
        </div>
    );
};

export default CourseContentManager;
