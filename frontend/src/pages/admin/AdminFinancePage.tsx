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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MoreHorizontal, Download, Filter, Eye, RefreshCcw, Trash2, DollarSign, TrendingUp, TrendingDown, BookOpen, Trophy, AlertCircle, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import FinanceTrendChart from "@/components/admin/bi/FinanceTrendChart";
import TopItemsChart from "@/components/admin/bi/TopItemsChart";
import { Textarea } from "@/components/ui/textarea";

// Mock Data Types
interface Transaction {
    id: string;
    user: string;
    type: "Course" | "Olympiad";
    item: string;
    amount: number;
    date: string;
    status: "Success" | "Failed" | "Refunded";
    paymentMethod: "Click" | "Payme";
}

const initialTransactions: Transaction[] = [
    { id: "TRX-1001", user: "Azizbek T.", type: "Course", item: "Matematika Pro", amount: 50000, date: "20 Jan, 10:30", status: "Success", paymentMethod: "Click" },
    { id: "TRX-1002", user: "Malika K.", type: "Olympiad", item: "Fizika Bahor", amount: 30000, date: "20 Jan, 11:15", status: "Success", paymentMethod: "Payme" },
    { id: "TRX-1003", user: "Jamshid A.", type: "Course", item: "Python Start", amount: 120000, date: "19 Jan, 15:45", status: "Failed", paymentMethod: "Click" },
    { id: "TRX-1004", user: "Sardor B.", type: "Course", item: "Ingliz tili", amount: 200000, date: "19 Jan, 09:20", status: "Refunded", paymentMethod: "Payme" },
    { id: "TRX-1005", user: "Madina O.", type: "Olympiad", item: "Mantiqiy Yechimlar", amount: 20000, date: "18 Jan, 14:00", status: "Success", paymentMethod: "Click" },
];

const AdminFinancePage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // UI States
    const [refundId, setRefundId] = useState<string | null>(null);
    const [refundReason, setRefundReason] = useState("");

    const { toast } = useToast();

    // FILTER LOGIC
    const filteredTransactions = transactions.filter(trx => {
        const matchesSearch = trx.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trx.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trx.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || trx.type === typeFilter;
        const matchesStatus = statusFilter === "all" || trx.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    // HANDLERS
    const handleRefund = () => {
        if (!refundId) return;
        setTransactions(transactions.map(t => t.id === refundId ? { ...t, status: "Refunded" } : t));
        toast({ title: "Mablag' qaytarildi", description: `ID: ${refundId}. Sabab: ${refundReason}` });
        setRefundId(null);
        setRefundReason("");
    };

    const handleDelete = (id: string) => {
        // Soft delete logic would go here
        setTransactions(transactions.filter(t => t.id !== id));
        toast({ title: "Tranzaksiya o'chirildi", description: "Ma'lumotlar arxivlandi." });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Success': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Muvaffaqiyatli</Badge>;
            case 'Failed': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Xatolik</Badge>;
            case 'Refunded': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Qaytarilgan</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatMoney = (amount: number) => {
        return amount.toLocaleString() + " so'm";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Moliya</h1>
                    <p className="text-gray-500">To'lovlar monitoringi va daromadlar tahlili</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Hisobot (PDF)
                    </Button>
                    <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                    </Button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +12.5%
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-gray-900">12,450,000</div>
                        <div className="text-sm text-gray-500 font-medium">Jami tushum (Oylik)</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                            Bugun: 45 ta
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-gray-900">204</div>
                        <div className="text-sm text-gray-500 font-medium">Yangi to'lovlar</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-xl text-red-600">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">
                            -2.1%
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-gray-900">1,200,000</div>
                        <div className="text-sm text-gray-500 font-medium">Qaytarilgan mablag'lar</div>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid lg:grid-cols-2 gap-6">
                <FinanceTrendChart />
                <TopItemsChart />
            </div>

            {/* FILTERS & SEARCH */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="ID, Foydalanuvchi yoki Item..."
                        className="pl-9 bg-gray-50 border-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Turi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barchasi</SelectItem>
                            <SelectItem value="Course">Kurslar</SelectItem>
                            <SelectItem value="Olympiad">Olimpiadalar</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barchasi</SelectItem>
                            <SelectItem value="Success">Success</SelectItem>
                            <SelectItem value="Failed">Failed</SelectItem>
                            <SelectItem value="Refunded">Refunded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* TRANSACTIONS TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Foydalanuvchi</TableHead>
                            <TableHead>Mahsulot</TableHead>
                            <TableHead>Summa & Metod</TableHead>
                            <TableHead>Sana</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.map((trx) => (
                            <TableRow key={trx.id} className="hover:bg-gray-50/50">
                                <TableCell className="font-mono text-xs text-gray-500">{trx.id}</TableCell>
                                <TableCell>
                                    <div className="font-bold text-gray-900">{trx.user}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {trx.type === 'Course' ? (
                                            <BookOpen className="w-4 h-4 text-blue-500" />
                                        ) : (
                                            <Trophy className="w-4 h-4 text-purple-500" />
                                        )}
                                        <span className="text-sm text-gray-700">{trx.item}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 ml-6 uppercase font-medium">{trx.type}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-gray-900">{formatMoney(trx.amount)}</div>
                                    <div className="text-xs text-gray-500">{trx.paymentMethod}</div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {trx.date}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(trx.status)}
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
                                                <Eye className="w-4 h-4 mr-2" /> Tafsilotlar
                                            </DropdownMenuItem>

                                            {trx.status === 'Success' && (
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-yellow-600 focus:text-yellow-700 focus:bg-yellow-50"
                                                    onClick={() => setRefundId(trx.id)}
                                                >
                                                    <RefreshCcw className="w-4 h-4 mr-2" /> Qaytarish (Refund)
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                onClick={() => handleDelete(trx.id)}
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

                {filteredTransactions.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900">Tranzaksiyalar topilmadi</h3>
                        <p className="text-gray-500 mb-6">Qidiruvni o'zgartirib ko'ring.</p>
                        <Button variant="outline" onClick={() => { setSearchQuery(""); setTypeFilter("all"); setStatusFilter("all") }}>
                            Filtrlarni tozalash
                        </Button>
                    </div>
                )}
            </div>

            {/* Refund Dialog */}
            <Dialog open={!!refundId} onOpenChange={(open) => !open && setRefundId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-yellow-600">
                            <AlertCircle className="w-5 h-5" />
                            Mablag'ni qaytarish (Refund)
                        </DialogTitle>
                        <DialogDescription>
                            Siz <strong>{refundId}</strong> ID raqamli tranzaksiya uchun pulni qaytarmoqchisiz.
                            Bu amalni ortga qaytarib bo'lmaydi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Qaytarish sababi</label>
                        <Textarea
                            placeholder="Mijoz talabiga binoan..."
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRefundId(null)}>Bekor qilish</Button>
                        <Button variant="default" className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={handleRefund} disabled={!refundReason}>
                            Tasdiqlash va Qaytarish
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default AdminFinancePage;
