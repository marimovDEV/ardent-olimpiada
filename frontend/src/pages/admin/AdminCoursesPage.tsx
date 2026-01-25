import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, MoreHorizontal, Plus, Filter, Eye, Edit, Trash2, Users, BookOpen, DollarSign, TrendingUp, AlertTriangle, Archive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Mock Data Types
interface Course {
    id: string;
    title: string;
    subject: "Matematika" | "Fizika" | "Informatika" | "Ingliz tili" | "Mantiq";
    level: "Beginner" | "Olympiad" | "Pro";
    students: number;
    price: number;
    revenue: number;
    status: "Active" | "Draft" | "Archived";
    lessons: number;
    rating: number;
}

const initialCourses: Course[] = [
    { id: "CRS-101", title: "Matematika Asoslari", subject: "Matematika", level: "Beginner", students: 1245, price: 0, revenue: 0, status: "Active", lessons: 24, rating: 4.8 },
    { id: "CRS-102", title: "Python Pro", subject: "Informatika", level: "Pro", students: 850, price: 150000, revenue: 127500000, status: "Active", lessons: 48, rating: 4.9 },
    { id: "CRS-103", title: "Fizika Olimpiada 2024", subject: "Fizika", level: "Olympiad", students: 320, price: 200000, revenue: 64000000, status: "Active", lessons: 30, rating: 4.7 },
    { id: "CRS-104", title: "Mantiqiy Fikrlash", subject: "Mantiq", level: "Beginner", students: 0, price: 50000, revenue: 0, status: "Draft", lessons: 10, rating: 0 },
    { id: "CRS-105", title: "IELTS Speaking", subject: "Ingliz tili", level: "Pro", students: 2100, price: 0, revenue: 0, status: "Archived", lessons: 15, rating: 4.5 },
];

const AdminCoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subjectFilter, setSubjectFilter] = useState("all");

    // UI States
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [newCourse, setNewCourse] = useState<Partial<Course>>({ subject: "Matematika", level: "Beginner", status: "Draft" });

    const { toast } = useToast();

    // FILTER LOGIC
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || course.status === statusFilter;
        const matchesSubject = subjectFilter === "all" || course.subject === subjectFilter;
        return matchesSearch && matchesStatus && matchesSubject;
    });

    // HANDLERS
    const handleAddCourse = () => {
        const course: Course = {
            id: `CRS-${100 + courses.length + 1}`,
            title: newCourse.title || "Yangi Kurs",
            subject: newCourse.subject as any,
            level: newCourse.level as any,
            students: 0,
            price: newCourse.price || 0,
            revenue: 0,
            status: newCourse.status as any,
            lessons: 0,
            rating: 0,
        };
        setCourses([course, ...courses]);
        setIsSheetOpen(false);
        setNewCourse({ subject: "Matematika", level: "Beginner", status: "Draft" });
        toast({ title: "Kurs yaratildi", description: `${course.title} muvaffaqiyatli qo'shildi` });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        const course = courses.find(c => c.id === deleteId);
        if (course?.students && course.students > 0) {
            // Soft delete
            setCourses(courses.map(c => c.id === deleteId ? { ...c, status: "Archived" } : c));
            toast({ title: "Kurs arxivlandi", description: "O'quvchilar borligi sababli kurs arxivga o'tkazildi." });
        } else {
            // Hard delete
            setCourses(courses.filter(c => c.id !== deleteId));
            toast({ title: "Kurs o'chirildi", variant: "destructive" });
        }
        setDeleteId(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Active</Badge>;
            case 'Draft': return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Draft</Badge>;
            case 'Archived': return <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">Archived</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatMoney = (amount: number) => {
        if (amount === 0) return "Bepul";
        return `${amount.toLocaleString()} so'm`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Kurslar Boshqaruvi</h1>
                    <p className="text-gray-500">Platformadagi ta'lim kontentini to'liq nazorat qilish</p>
                </div>

                {/* Add Course Wizard (Sheet) */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                            <Plus className="w-4 h-4 mr-2" />
                            Yangi Kurs
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                        <SheetHeader className="mb-6">
                            <SheetTitle>Yangi Kurs Yaratish</SheetTitle>
                            <SheetDescription>
                                Kurs ma'lumotlarini to'ldiring. Kontent (video/test) keyingi bosqichda qo'shiladi.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-6">

                            {/* Step 1: Basic Info */}
                            <div className="space-y-4 border-b pb-6">
                                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                    Asosiy Ma'lumotlar
                                </h4>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Kurs Nomi</label>
                                    <Input
                                        placeholder="Masalan: Matematika Asoslari"
                                        value={newCourse.title}
                                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Fan</label>
                                        <Select value={newCourse.subject} onValueChange={(val) => setNewCourse({ ...newCourse, subject: val as any })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Matematika">Matematika</SelectItem>
                                                <SelectItem value="Fizika">Fizika</SelectItem>
                                                <SelectItem value="Informatika">Informatika</SelectItem>
                                                <SelectItem value="Ingliz tili">Ingliz tili</SelectItem>
                                                <SelectItem value="Mantiq">Mantiq</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Daraja</label>
                                        <Select value={newCourse.level} onValueChange={(val) => setNewCourse({ ...newCourse, level: val as any })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner (Boshlang'ich)</SelectItem>
                                                <SelectItem value="Pro">Pro (Chuqurlashtirilgan)</SelectItem>
                                                <SelectItem value="Olympiad">Olympiad (Olimpiada)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Qisqacha Tavsif</label>
                                    <Textarea placeholder="Kurs haqida 2-3 gap..." rows={3} />
                                </div>
                            </div>

                            {/* Step 2: Monetization */}
                            <div className="space-y-4 pb-6">
                                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    Monetizatsiya
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Narx (so'm)</label>
                                        <Input
                                            type="number"
                                            placeholder="0 = Bepul"
                                            value={newCourse.price}
                                            onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Status</label>
                                        <Select value={newCourse.status} onValueChange={(val) => setNewCourse({ ...newCourse, status: val as any })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Draft">Draft (Qoralama)</SelectItem>
                                                <SelectItem value="Active">Active (Nashr qilish)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <SheetFooter className="mt-6">
                            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Bekor qilish</Button>
                            <Button onClick={handleAddCourse} className="bg-blue-600 hover:bg-blue-700">Saqlash va Davom etish</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {/* CONTROL BAR: Stats & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Mini Stats */}
                <div className="md:col-span-4 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500 font-medium">Jami Kurslar</div>
                            <div className="text-xl font-black text-gray-900">{courses.length}</div>
                        </div>
                        <BookOpen className="w-8 h-8 text-blue-100" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500 font-medium">Faol O'quvchilar</div>
                            <div className="text-xl font-black text-gray-900">4,515</div>
                        </div>
                        <Users className="w-8 h-8 text-green-100" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500 font-medium">Umumiy Daromad</div>
                            <div className="text-xl font-black text-gray-900">191,500,000</div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-yellow-100" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500 font-medium">Top Reyting</div>
                            <div className="text-xl font-black text-gray-900">4.8</div>
                        </div>
                        <div className="text-yellow-400 text-2xl font-black">★</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="md:col-span-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Kurs nomi bo'yicha qidirish..."
                            className="pl-9 bg-gray-50 border-gray-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-1 md:pb-0">
                        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                            <SelectTrigger className="w-[140px] bg-white">
                                <SelectValue placeholder="Fan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Barcha Fanlar</SelectItem>
                                <SelectItem value="Matematika">Matematika</SelectItem>
                                <SelectItem value="Fizika">Fizika</SelectItem>
                                <SelectItem value="Informatika">Informatika</SelectItem>
                            </SelectContent>
                        </Select>

                        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
                            <TabsList className="bg-gray-100">
                                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                                <TabsTrigger value="Active" className="text-xs">Active</TabsTrigger>
                                <TabsTrigger value="Draft" className="text-xs">Draft</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* COURSES TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Kurs Nomi</TableHead>
                            <TableHead>Fan & Daraja</TableHead>
                            <TableHead>Narx</TableHead>
                            <TableHead>O'quvchilar</TableHead>
                            <TableHead>Daromad (BI)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCourses.map((course) => (
                            <TableRow key={course.id} className="hover:bg-gray-50/50 group">
                                <TableCell className="font-mono text-xs text-gray-500">{course.id}</TableCell>
                                <TableCell>
                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {course.title.substring(0, 2).toUpperCase()}
                                        </div>
                                        {course.title}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 ml-10">
                                        {course.lessons} dars • {course.rating} ★
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium">{course.subject}</span>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded w-fit ${course.level === 'Olympiad' ? 'bg-purple-100 text-purple-700' :
                                            course.level === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {course.level}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {formatMoney(course.price)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{course.students}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {course.revenue > 0 ? (
                                        <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">
                                            {formatMoney(course.revenue)}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(course.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Amallar</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Eye className="w-4 h-4 mr-2" /> Ko'rish
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Edit className="w-4 h-4 mr-2" /> Tahrirlash
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer text-orange-600">
                                                <Archive className="w-4 h-4 mr-2" /> Arxivlash
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                onClick={() => setDeleteId(course.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> O'chirish
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredCourses.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">Kurslar topilmadi</h3>
                        <p className="text-gray-500 mb-6">Qidiruv so'zini o'zgartirib ko'ring yoki yangi kurs qo'shing.</p>
                        <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setSubjectFilter("all") }}>
                            Filtrlarni tozalash
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Kursni o'chirish
                        </DialogTitle>
                        <DialogDescription>
                            Siz <strong>{courses.find(c => c.id === deleteId)?.title}</strong> kursini o'chirmoqchisiz.
                            {courses.find(c => c.id === deleteId)?.students! > 0 ? (
                                <div className="mt-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-yellow-800 text-sm font-medium">
                                    Diqqat! Bu kursda {courses.find(c => c.id === deleteId)?.students} ta o'quvchi bor.
                                    Kurs butunlay o'chirilmaydi, faqat "Arxiv"ga o'tkaziladi.
                                </div>
                            ) : (
                                <div className="mt-2 text-red-600">
                                    Bu kursda o'quvchilar yo'q. U butunlay o'chiriladi.
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {courses.find(c => c.id === deleteId)?.students! > 0 ? "Arxivlash" : "O'chirish"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default AdminCoursesPage;
