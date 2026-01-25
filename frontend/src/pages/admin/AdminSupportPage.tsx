import { useState, useEffect } from "react";
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
    FileText,
    Filter,
    RefreshCw,
    Mail,
    CheckCircle2,
    Eye,
    Lock,
    Pencil,
    Calendar as CalendarIcon,
    X
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

// Import Custom Components
import SupportAnalytics from "@/components/admin/support/SupportAnalytics";
import TicketDetailDialog from "@/components/admin/support/TicketDetailDialog";

// Types
interface Ticket {
    id: string;
    user: string;
    email: string;
    subject: string;
    category: "Payment" | "Technical" | "Course" | "Olympiad";
    priority: "Low" | "Medium" | "High";
    status: "Open" | "In Progress" | "Resolved" | "Escalated" | "Pending";
    date: string;
    lastMessage: string;
    isNew?: boolean; // For animation
}

const initialTickets: Ticket[] = [
    { id: "TCK-1024", user: "Azizbek T.", email: "aziz@gmail.com", subject: "To'lov o'tmadi", category: "Payment", priority: "High", status: "Open", date: "20 Jan, 10:30", lastMessage: "Payme orqali to'ladim, lekin kurs ochilmadi." },
    { id: "TCK-1023", user: "Malika K.", email: "malika@gmail.com", subject: "Sertifikat yuklanmayapti", category: "Technical", priority: "Medium", status: "In Progress", date: "19 Jan, 14:15", lastMessage: "Tekshirib ko'rayapmiz, biroz kuting." },
    { id: "TCK-1022", user: "Jamshid A.", email: "jamshid@edu.uz", subject: "Python kursida xatolik", category: "Course", priority: "Low", status: "Resolved", date: "18 Jan, 09:00", lastMessage: "Rahmat, muammo hal bo'ldi." },
    { id: "TCK-1021", user: "Sardor B.", email: "sardor@mail.ru", subject: "Olimpiada natijasi noto'g'ri", category: "Olympiad", priority: "High", status: "Escalated", date: "17 Jan, 16:20", lastMessage: "Natijamni qaydadan tekshirib bering!" },
    { id: "TCK-1020", user: "Shahlo M.", email: "shahlo@gmail.com", subject: "Video ochilmayapti", category: "Technical", priority: "Medium", status: "Pending", date: "17 Jan, 11:00", lastMessage: "Internetim yaxshi lekin player qotyapti" },
];

const AdminSupportPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [searchQuery, setSearchQuery] = useState("");

    // Advanced Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [dateRange, setDateRange] = useState<Date | undefined>();

    // Interactive States
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);

    const { toast } = useToast();

    // SIMULATED REAL-TIME UPDATES
    useEffect(() => {
        const interval = setInterval(() => {
            // 20% chance to duplicate a random ticket as "New"
            if (Math.random() > 0.8) {
                const randomId = Math.floor(Math.random() * 1000);
                const newTicket: Ticket = {
                    id: `TCK-${2000 + randomId}`,
                    user: "Mehmon Foydalanuvchi",
                    email: `user${randomId}@gmail.com`,
                    subject: "Yangi savol (Real-time)",
                    category: "Course",
                    priority: "Medium",
                    status: "Open",
                    date: "Hozirgina",
                    lastMessage: "Salom, kursni qanday sotib olsam bo'ladi?",
                    isNew: true
                };

                setTickets(prev => [newTicket, ...prev]);
                toast({
                    title: "🔔 Yangi Ticket!",
                    description: `${newTicket.user} yangi murojaat qoldirdi.`,
                    duration: 3000,
                });
            }
        }, 15000); // Check every 15 seconds

        return () => clearInterval(interval);
    }, []);

    // FILTER LOGIC
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
        const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
        // Mock Date Check - in real app would use date-fns isWithinInterval
        const matchesDate = !dateRange || true;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDate;
    });

    // HANDLERS
    const handleStatusChange = (newStatus: string) => {
        if (!selectedTicket) return;

        const updatedTickets = tickets.map(t =>
            t.id === selectedTicket.id ? { ...t, status: newStatus as any } : t
        );
        setTickets(updatedTickets);

        toast({ title: "Status o'zgardi", description: `Ticket #${selectedTicket.id} statusi ${newStatus} ga o'zgartirildi.` });

        // Simulating Escalation Alert
        if (newStatus === "Escalated") {
            toast({ title: "Escalation Sent", description: "Super Admin xabardor qilindi.", variant: "destructive" });
        }

        setSelectedTicket({ ...selectedTicket, status: newStatus as any });
    };

    const handleReply = (message: string) => {
        toast({ title: "Javob yuborildi", description: "Mijozga xabaringiz yetkazildi." });
    };

    const toggleSelect = (id: string) => {
        if (selectedTicketIds.includes(id)) {
            setSelectedTicketIds(selectedTicketIds.filter(tid => tid !== id));
        } else {
            setSelectedTicketIds([...selectedTicketIds, id]);
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedTicketIds.length === 0) return;

        if (action === "resolve") {
            setTickets(tickets.map(t => selectedTicketIds.includes(t.id) ? { ...t, status: "Resolved" } : t));
            toast({ title: "Bulk Action", description: `${selectedTicketIds.length} ta ticket yopildi.` });
        }

        setSelectedTicketIds([]);
    };

    // Render Helpers
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'High': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">High</Badge>;
            case 'Medium': return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Medium</Badge>;
            case 'Low': return <Badge variant="outline" className="text-gray-500">Low</Badge>;
            default: return <Badge variant="outline">{priority}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Open': return <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse">Open</Badge>;
            case 'In Progress': return <Badge className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
            case 'Resolved': return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200"><CheckCircle2 className="w-3 h-3 mr-1" />Resolved</Badge>;
            case 'Escalated': return <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-200">Escalated</Badge>;
            case 'Pending': return <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">Pending</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Yordam Markazi</h1>
                    <p className="text-gray-500">Murojaatlar boshqaruvi va mijozlar xizmati</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { toast({ title: "Refresh", description: "Ma'lumotlar yangilandi" }) }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Yangilash
                    </Button>
                    <Button variant="hero" className="shadow-lg shadow-blue-200">
                        <FileText className="w-4 h-4 mr-2" />
                        Hisobot (PDF)
                    </Button>
                </div>
            </div>

            {/* Analytics Section */}
            <SupportAnalytics />

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                {/* Advanced Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col gap-4 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="ID, Mavzu yoki Foydalanuvchi qidirish..."
                                className="pl-9 bg-white border-gray-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filtering */}
                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            <Filter className="w-4 h-4 text-gray-400 mr-1" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px] bg-white text-xs h-9">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Barchasi</SelectItem>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Escalated">Escalated</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-[130px] bg-white text-xs h-9">
                                    <SelectValue placeholder="Muhimlik" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Barchasi</SelectItem>
                                    <SelectItem value="High">High Priority</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[130px] bg-white text-xs h-9">
                                    <SelectValue placeholder="Kategoriya" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Barchasi</SelectItem>
                                    <SelectItem value="Payment">Payment</SelectItem>
                                    <SelectItem value="Technical">Technical</SelectItem>
                                    <SelectItem value="Course">Course</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Date Range Simulation */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[140px] justify-start text-left font-normal text-xs h-9 bg-white",
                                            !dateRange && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
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

                    {/* Bulk Selection Actions */}
                    {selectedTicketIds.length > 0 && (
                        <div className="flex items-center gap-4 bg-blue-50 p-2 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
                            <span className="text-sm font-bold text-blue-700 ml-2">{selectedTicketIds.length} ta tanlandi</span>
                            <div className="h-4 w-px bg-blue-200" />
                            <Button size="sm" variant="ghost" className="text-blue-700 hover:text-blue-800 hover:bg-blue-100" onClick={() => handleBulkAction("resolve")}>
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Hal qilindi
                            </Button>
                            <Button size="sm" variant="ghost" className="text-blue-700 hover:text-blue-800 hover:bg-blue-100">
                                <Mail className="w-4 h-4 mr-2" /> Email yuborish
                            </Button>
                        </div>
                    )}
                </div>

                {/* Ticket List */}
                <div className="flex-1 overflow-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50 sticky top-0 z-10 shadow-sm">
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedTicketIds.length === filteredTickets.length && filteredTickets.length > 0}
                                        onCheckedChange={(checked) => {
                                            if (checked) setSelectedTicketIds(filteredTickets.map(t => t.id));
                                            else setSelectedTicketIds([]);
                                        }}
                                    />
                                </TableHead>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Foydalanuvchi</TableHead>
                                <TableHead>Mavzu & Kategoriya</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Sana</TableHead>
                                <TableHead>Prioritet</TableHead>
                                <TableHead className="text-right">Amal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.map((ticket) => (
                                <TableRow
                                    key={ticket.id}
                                    className={`cursor-pointer group transition-colors ${selectedTicketIds.includes(ticket.id) ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-gray-50"} ${ticket.isNew ? "animate-pulse bg-green-50" : ""}`}
                                    onClick={(e) => {
                                        // Prevent opening dialog if clicking checkbox or buttons
                                        if ((e.target as HTMLElement).closest('[role="checkbox"]') || (e.target as HTMLElement).closest('button')) return;
                                        setSelectedTicket(ticket);
                                    }}
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedTicketIds.includes(ticket.id)}
                                            onCheckedChange={() => toggleSelect(ticket.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-xs text-gray-500 group-hover:text-blue-600 font-medium">{ticket.id}</span>
                                        {ticket.isNew && <Badge className="ml-2 bg-green-500 text-[10px] px-1 py-0 h-4">New</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-gray-900">{ticket.user}</div>
                                        <div className="text-xs text-gray-500">{ticket.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-gray-800">{ticket.subject}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">{ticket.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(ticket.status)}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500">{ticket.date}</TableCell>
                                    <TableCell>
                                        {getPriorityBadge(ticket.priority)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => setSelectedTicket(ticket)}>
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Ko'rish</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100" onClick={() => setSelectedTicket(ticket)}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Tahrirlash</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); toast({ title: "Closed", description: "Ticket yopildi" }) }}>
                                                            <Lock className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Yopish</TooltipContent>
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

            {/* Detail Dialog */}
            <TicketDetailDialog
                ticket={selectedTicket}
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onStatusChange={handleStatusChange}
                onReply={handleReply}
            />

        </div>
    );
};

export default AdminSupportPage;
