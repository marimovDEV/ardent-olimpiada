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
import { Search, MoreHorizontal, Plus, Filter, Eye, Edit, Trash2, Calendar, Clock, Trophy, Users, AlertTriangle, Archive, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

// Mock Data Types
interface Olympiad {
    id: string;
    title: string;
    subject: "Matematika" | "Fizika" | "Informatika" | "Ingliz tili" | "Mantiq";
    level: "Beginner" | "Olympiad" | "Pro";
    date: string;
    time: string;
    participants: number;
    maxParticipants: number;
    price: number;
    status: "Active" | "Upcoming" | "Completed" | "Draft" | "Archived";
}

const initialOlympiads: Olympiad[] = [
    { id: "OLY-201", title: "Matematika Respublika", subject: "Matematika", level: "Pro", date: "2024-01-20", time: "10:00", participants: 847, maxParticipants: 1000, price: 50000, status: "Active" },
    { id: "OLY-202", title: "Fizika Bahorgi Mavsum", subject: "Fizika", level: "Olympiad", date: "2024-03-01", time: "09:00", participants: 120, maxParticipants: 500, price: 30000, status: "Upcoming" },
    { id: "OLY-203", title: "Python Battle", subject: "Informatika", level: "Pro", date: "2023-12-15", time: "15:00", participants: 450, maxParticipants: 500, price: 0, status: "Completed" },
    { id: "OLY-204", title: "Mantiqiy Yechimlar", subject: "Mantiq", level: "Beginner", date: "2024-02-10", time: "14:00", participants: 0, maxParticipants: 200, price: 20000, status: "Draft" },
];

const AdminOlympiadsPage = () => {
    const [olympiads, setOlympiads] = useState<Olympiad[]>(initialOlympiads);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subjectFilter, setSubjectFilter] = useState("all");

    // UI States
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [newOlympiad, setNewOlympiad] = useState<Partial<Olympiad>>({ subject: "Matematika", level: "Olympiad", status: "Draft", maxParticipants: 100 });

    const { toast } = useToast();

    // FILTER LOGIC
    const filteredOlympiads = olympiads.filter(oly => {
        const matchesSearch = oly.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || oly.status === statusFilter;
        // Group Upcoming/Active together if needed, but strict filtering is better for admin
        const matchesSubject = subjectFilter === "all" || oly.subject === subjectFilter;
        return matchesSearch && matchesStatus && matchesSubject;
    });

    // HANDLERS
    const handleAddOlympiad = () => {
        const oly: Olympiad = {
            id: `OLY-${200 + olympiads.length + 1}`,
            title: newOlympiad.title || "Yangi Olimpiada",
            subject: newOlympiad.subject as any,
            level: newOlympiad.level as any,
            date: newOlympiad.date || "2024-01-01",
            time: newOlympiad.time || "10:00",
            participants: 0,
            maxParticipants: newOlympiad.maxParticipants || 100,
            price: newOlympiad.price || 0,
            status: newOlympiad.status as any,
        };
        setOlympiads([oly, ...olympiads]);
        setIsSheetOpen(false);
        setNewOlympiad({ subject: "Matematika", level: "Olympiad", status: "Draft", maxParticipants: 100 });
        toast({ title: "Olimpiada yaratildi", description: `${oly.title} muvaffaqiyatli qo'shildi` });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        const oly = olympiads.find(c => c.id === deleteId);
        if (oly?.participants && oly.participants > 0) {
            // Soft delete
            setOlympiads(olympiads.map(c => c.id === deleteId ? { ...c, status: "Archived" } : c));
            toast({ title: "Olimpiada arxivlandi", description: "Qatnashchilar borligi sababli arxivga o'tkazildi." });
        } else {
            // Hard delete
            setOlympiads(olympiads.filter(c => c.id !== deleteId));
            toast({ title: "Olimpiada o'chirildi", variant: "destructive" });
        }
        setDeleteId(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 animate-pulse">Active (Live)</Badge>;
            case 'Upcoming': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Upcoming</Badge>;
            case 'Completed': return <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">Completed</Badge>;
            case 'Draft': return <Badge variant="outline" className="text-gray-500">Draft</Badge>;
            case 'Archived': return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">Archived</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatMoney = (amount: number) => {
        if (amount === 0) return "Bepul";
        return `${(amount / 1000).toFixed(0)}k so'm`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Olimpiadalar Boshqaruvi</h1>
                    <p className="text-gray-500">Musobaqalar taqvimi va ishtirokchilar nazorati</p>
                </div>

                {/* Add Olympiad Wizard (Sheet) */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                            <Plus className="w-4 h-4 mr-2" />
                            Yangi Olimpiada
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                        <SheetHeader className="mb-6">
                            <SheetTitle>Yangi Olimpiada Yaratish</SheetTitle>
                            <SheetDescription>
                                Musobaqa parametrlari va cheklovlarini belgilang.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-6">

                            {/* Step 1: Basic Info */}
                            <div className="space-y-4 border-b pb-6">
                                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    Asosiy Ma'lumotlar
                                </h4>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Olimpiada Nomi</label>
                                    <Input
                                        placeholder="Masalan: Respublika Matematika Olimpiadasi"
                                        value={newOlympiad.title}
                                        onChange={(e) => setNewOlympiad({ ...newOlympiad, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Fan</label>
                                        <Select value={newOlympiad.subject} onValueChange={(val) => setNewOlympiad({ ...newOlympiad, subject: val as any })}>
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
                                        <Select value={newOlympiad.level} onValueChange={(val) => setNewOlympiad({ ...newOlympiad, level: val as any })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Pro">Pro</SelectItem>
                                                <SelectItem value="Olympiad">Olympiad</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Schedule & Limits */}
                            <div className="space-y-4 pb-6">
                                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Vaqt va Limitlar
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Sana</label>
                                        <Input
                                            type="date"
                                            value={newOlympiad.date}
                                            onChange={(e) => setNewOlympiad({ ...newOlympiad, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Boshlanish Vaqti</label>
                                        <Input
                                            type="time"
                                            value={newOlympiad.time}
                                            onChange={(e) => setNewOlympiad({ ...newOlympiad, time: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Max Qatnashchilar</label>
                                        <Input
                                            type="number"
                                            value={newOlympiad.maxParticipants}
                                            onChange={(e) => setNewOlympiad({ ...newOlympiad, maxParticipants: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Narx</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={newOlympiad.price}
                                            onChange={(e) => setNewOlympiad({ ...newOlympiad, price: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select value={newOlympiad.status} onValueChange={(val) => setNewOlympiad({ ...newOlympiad, status: val as any })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft (Qoralama)</SelectItem>
                                            <SelectItem value="Upcoming">Upcoming (E'lon qilish)</SelectItem>
                                            <SelectItem value="Active">Active (Hozir bo'lyapti)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                        </div>
                        <SheetFooter className="mt-6">
                            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Bekor qilish</Button>
                            <Button onClick={handleAddOlympiad} className="bg-blue-600 hover:bg-blue-700">Saqlash</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {/* FILTERS TOOLBAR */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Olimpiada nomi bo'yicha..."
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
                            <TabsTrigger value="Upcoming" className="text-xs">Upcoming</TabsTrigger>
                            <TabsTrigger value="Completed" className="text-xs">Past</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* OLYMPIADS TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Olimpiada</TableHead>
                            <TableHead>Vaqt</TableHead>
                            <TableHead>Daraja & Narx</TableHead>
                            <TableHead className="w-[200px]">Qatnashchilar (Progress)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOlympiads.map((oly) => (
                            <TableRow key={oly.id} className="hover:bg-gray-50/50 group">
                                <TableCell className="font-mono text-xs text-gray-500">{oly.id}</TableCell>
                                <TableCell>
                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                        <Trophy className={`w-4 h-4 ${oly.subject === 'Matematika' ? 'text-blue-500' : 'text-purple-500'}`} />
                                        {oly.title}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {oly.subject}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="font-medium flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                            {oly.date}
                                        </span>
                                        <span className="text-gray-500 text-xs flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            {oly.time}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded w-fit ${oly.level === 'Olympiad' ? 'bg-purple-100 text-purple-700' :
                                                oly.level === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {oly.level}
                                        </span>
                                        <span className="text-xs font-medium text-gray-600">
                                            {formatMoney(oly.price)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-gray-700">{oly.participants} ta</span>
                                            <span className="text-gray-400">/ {oly.maxParticipants}</span>
                                        </div>
                                        <Progress value={(oly.participants / oly.maxParticipants) * 100} className="h-2" />
                                        {(oly.participants / oly.maxParticipants) * 100 > 80 && (
                                            <div className="text-[10px] text-orange-600 font-bold flex items-center gap-1 mt-1">
                                                <AlertTriangle className="w-3 h-3" /> Deyarli to'lgan!
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(oly.status)}
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
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Users className="w-4 h-4 mr-2" /> Qatnashchilar
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                onClick={() => setDeleteId(oly.id)}
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

                {filteredOlympiads.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">Olimpiadalar topilmadi</h3>
                        <p className="text-gray-500 mb-6">Filtrlarni o'zgartirib ko'ring yoki yangi musobaqa qo'shing.</p>
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
                            Olimpiadani o'chirish
                        </DialogTitle>
                        <DialogDescription>
                            Siz <strong>{olympiads.find(c => c.id === deleteId)?.title}</strong> ni o'chirmoqchisiz.
                            {olympiads.find(c => c.id === deleteId)?.participants! > 0 ? (
                                <div className="mt-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-yellow-800 text-sm font-medium">
                                    Diqqat! Bu olimpiadaga {olympiads.find(c => c.id === deleteId)?.participants} ta o'quvchi ro'yxatdan o'tgan.
                                    Ma'lumotlar yo'qolmasligi uchun u "Arxiv"ga o'tkaziladi.
                                </div>
                            ) : (
                                <div className="mt-2 text-red-600">
                                    Hali qatnashchilar yo'q. Musobaqa butunlay o'chiriladi.
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {olympiads.find(c => c.id === deleteId)?.participants! > 0 ? "Arxivlash" : "O'chirish"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default AdminOlympiadsPage;
