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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Search,
    MoreHorizontal,
    Award,
    Download,
    CheckCircle,
    XCircle,
    QrCode,
    ExternalLink,
    Clock,
    Filter,
    Calendar as CalendarIcon,
    Mail,
    RefreshCw,
    Eye
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock Data
interface Certificate {
    id: string;
    user: string;
    email: string;
    course: string;
    date: string;
    grade: string;
    status: "Verified" | "Pending" | "Rejected" | "Expired";
    isNew?: boolean;
}

const initialCertificates: Certificate[] = [
    { id: "CRT-9001", user: "Azizbek T.", email: "aziz@gmail.com", course: "Matematika Pro", date: "20 Jan 2024", grade: "98%", status: "Verified" },
    { id: "CRT-9002", user: "Malika K.", email: "malika@gmail.com", course: "Fizika Olimpiada", date: "18 Jan 2024", grade: "85%", status: "Verified" },
    { id: "CRT-9003", user: "Jamshid A.", email: "jamshid@edu.uz", course: "Python Start", date: "15 Jan 2024", grade: "Pending", status: "Pending" },
    { id: "CRT-9004", user: "Sardor B.", email: "sardor@mail.ru", course: "Web Dasturlash", date: "14 Jan 2024", grade: "45%", status: "Rejected" },
    { id: "CRT-9005", user: "Shahlo M.", email: "shahlo@gmail.com", course: "Ingliz tili B2", date: "10 Jan 2024", grade: "Pending", status: "Pending" },
    { id: "CRT-9006", user: "Botir Q.", email: "botir@yandex.com", course: "Olimpiada Qish 2023", date: "20 Dec 2023", grade: "92%", status: "Expired" },
];

const AdminCertificatesPage = () => {
    const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [dateRange, setDateRange] = useState<Date | undefined>();

    // Selection
    const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);

    // FILTER LOGIC
    const filteredCerts = certificates.filter(cert => {
        const matchesSearch = cert.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || cert.course.includes(categoryFilter);

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // HANDLERS
    const handleVerify = (id: string) => {
        setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: "Verified", grade: "100%" } : c));
        toast({
            title: "Sertifikat Tasdiqlandi",
            description: `#${id} raqamli sertifikat muvaffaqiyatli tasdiqlandi.`,
            className: "bg-green-50 border-green-200"
        });
    };

    const handleReject = (id: string) => {
        setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: "Rejected" } : c));
        toast({
            title: "Sertifikat Rad Etildi",
            description: "O'quvchiga rad etish sababi haqida xabar yuborildi.",
            variant: "destructive"
        });
    };

    const handleBatchAction = (action: "approve" | "reject") => {
        if (selectedCertIds.length === 0) return;

        const newStatus = action === "approve" ? "Verified" : "Rejected";
        setCertificates(prev => prev.map(c => selectedCertIds.includes(c.id) ? { ...c, status: newStatus } : c));

        toast({
            title: "Batch Operation",
            description: `${selectedCertIds.length} ta sertifikat ${action === "approve" ? "tasdiqlandi" : "rad etildi"}.`
        });
        setSelectedCertIds([]);
    };

    const toggleSelect = (id: string) => {
        if (selectedCertIds.includes(id)) {
            setSelectedCertIds(selectedCertIds.filter(cid => cid !== id));
        } else {
            setSelectedCertIds([...selectedCertIds, id]);
        }
    };

    // UI Helpers
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Verified': return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
            case 'Pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
            case 'Rejected': return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            case 'Expired': return <Badge variant="secondary" className="bg-gray-100 text-gray-500 hover:bg-gray-200">Expired</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Sertifikatlar</h1>
                    <p className="text-gray-500">Bitiruvchilar va yutuqlarni tasdiqlash markazi</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { toast({ title: "Yangilandi" }) }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Yangilash
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200">
                        <Award className="w-4 h-4 mr-2" />
                        Yangi Sertifikat
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-sm text-gray-500 font-medium mb-1">Jami Berilgan</div>
                    <div className="text-2xl font-black text-gray-900">1,248</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-sm text-gray-500 font-medium mb-1">Bu Oy</div>
                    <div className="text-2xl font-black text-green-600 flex items-center gap-2">
                        +142 <span className="text-xs bg-green-50 px-2 py-0.5 rounded-full text-green-700">↑ 12%</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-yellow-100 bg-yellow-50/30 shadow-sm">
                    <div className="text-sm text-yellow-700 font-medium mb-1">Kutilmoqda (Pending)</div>
                    <div className="text-2xl font-black text-yellow-600">15</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-200 flex flex-col justify-center cursor-pointer hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <QrCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold">Tezkor Tekshirish</div>
                            <div className="text-xs text-purple-200">QR Kod skanerlash</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Ism yoki ID bo'yicha qidirish..."
                                className="pl-9 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            <Filter className="w-4 h-4 text-gray-400 mr-1" />

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px] bg-white text-xs h-9">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Barcha Status</SelectItem>
                                    <SelectItem value="Verified">Verified</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[130px] bg-white text-xs h-9">
                                    <SelectValue placeholder="Kurs turi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Barcha Kurslar</SelectItem>
                                    <SelectItem value="Matematika">Matematika</SelectItem>
                                    <SelectItem value="Fizika">Fizika</SelectItem>
                                    <SelectItem value="Python">Python</SelectItem>
                                </SelectContent>
                            </Select>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[130px] justify-start text-left font-normal text-xs h-9 bg-white",
                                            !dateRange && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                        {dateRange ? format(dateRange, "PPP") : <span>Sana</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Batch Actions */}
                    {selectedCertIds.length > 0 && (
                        <div className="flex items-center gap-4 bg-purple-50 p-2 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 pl-2">
                                <div className="bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {selectedCertIds.length}
                                </div>
                                <span className="text-sm font-bold text-purple-900">Tanlandi</span>
                            </div>
                            <div className="h-4 w-px bg-purple-200" />
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs" onClick={() => handleBatchAction("approve")}>
                                <CheckCircle className="w-3 h-3 mr-1.5" /> Tasdiqlash
                            </Button>
                            <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleBatchAction("reject")}>
                                <XCircle className="w-3 h-3 mr-1.5" /> Rad etish
                            </Button>
                            <Button size="sm" variant="ghost" className="text-purple-700 hover:bg-purple-100 h-7 text-xs">
                                <Mail className="w-3 h-3 mr-1.5" /> Email yuborish
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedCertIds.length === filteredCerts.length && filteredCerts.length > 0}
                                        onCheckedChange={(checked) => {
                                            if (checked) setSelectedCertIds(filteredCerts.map(c => c.id));
                                            else setSelectedCertIds([]);
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Cert ID</TableHead>
                                <TableHead>O'quvchi</TableHead>
                                <TableHead>Kurs/Olimpiada</TableHead>
                                <TableHead>Natija</TableHead>
                                <TableHead>Sana</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amallar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCerts.map((cert) => (
                                <TableRow
                                    key={cert.id}
                                    className={`cursor-pointer group transition-colors ${selectedCertIds.includes(cert.id) ? "bg-purple-50/50 hover:bg-purple-50" : "hover:bg-gray-50"}`}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('[role="checkbox"]') || (e.target as HTMLElement).closest('button')) return;
                                        toggleSelect(cert.id);
                                    }}
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedCertIds.includes(cert.id)}
                                            onCheckedChange={() => toggleSelect(cert.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </TableCell>
                                    <TableCell className="font-mono text-xs font-bold text-gray-500 group-hover:text-purple-600">{cert.id}</TableCell>
                                    <TableCell>
                                        <div className="font-bold text-gray-900">{cert.user}</div>
                                        <div className="text-xs text-gray-500">{cert.email}</div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 font-medium">{cert.course}</TableCell>
                                    <TableCell>
                                        {cert.grade === 'Pending' ? (
                                            <span className="text-xs text-gray-400 italic">Baholanmoqda...</span>
                                        ) : (
                                            <span className={`font-bold ${parseInt(cert.grade) > 80 ? 'text-green-600' : 'text-yellow-600'}`}>{cert.grade}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500">{cert.date}</TableCell>
                                    <TableCell>{getStatusBadge(cert.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                {cert.status === 'Pending' && (
                                                    <>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleVerify(cert.id)}>
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Tasdiqlash</TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleReject(cert.id)}>
                                                                    <XCircle className="w-4 h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Rad etish</TooltipContent>
                                                        </Tooltip>
                                                    </>
                                                )}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Ko'rish</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Yuklash (PDF)</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TooltipProvider>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminCertificatesPage;
