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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, UserPlus, Filter, Eye, Edit, Ban, CheckCircle, Smartphone, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock Data Types
interface User {
    id: string;
    name: string;
    phone: string;
    role: "Student" | "Teacher" | "Admin";
    status: "Active" | "Blocked" | "Pending";
    lastLogin: string;
    joined: string;
}

const initialUsers: User[] = [
    { id: "ID-1001", name: "Azizbek T.", phone: "+998 90 123 45 67", role: "Student", status: "Active", lastLogin: "Bugun, 10:30", joined: "20 Jan" },
    { id: "ID-1002", name: "Malika K.", phone: "+998 93 777 88 99", role: "Student", status: "Blocked", lastLogin: "15 Jan, 14:00", joined: "18 Jan" },
    { id: "ID-1003", name: "Mirzo U.", phone: "+998 97 121 21 21", role: "Teacher", status: "Active", lastLogin: "Bugun, 09:00", joined: "15 Dec" },
    { id: "ID-1004", name: "Admin User", phone: "+998 99 999 99 99", role: "Admin", status: "Active", lastLogin: "Hozir", joined: "01 Nov" },
    { id: "ID-1005", name: "Shaxzod B.", phone: "+998 88 555 33 22", role: "Student", status: "Pending", lastLogin: "-", joined: "Bugun" },
];

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Dialog States
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", phone: "+998 ", role: "Student" });

    const { toast } = useToast();

    // FILTER LOGIC
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // HANDLERS
    const handleAddUser = () => {
        const id = `ID-${1000 + users.length + 1}`;
        const user: User = {
            id,
            name: newUser.name,
            phone: newUser.phone,
            role: newUser.role as any,
            status: "Active", // Default active
            lastLogin: "-",
            joined: "Bugun"
        };
        setUsers([user, ...users]);
        setIsAddUserOpen(false);
        setNewUser({ name: "", phone: "+998 ", role: "Student" });
        toast({ title: "Foydalanuvchi qo'shildi", description: `${user.name} tizimga muvaffaqiyatli qo'shildi` });
    };

    const handleStatusChange = (userId: string, newStatus: User['status']) => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        const action = newStatus === 'Blocked' ? "bloklandi" : "faollashtirildi";
        toast({ title: `Foydalanuvchi ${action}`, variant: newStatus === 'Blocked' ? "destructive" : "default" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Active</Badge>;
            case 'Blocked': return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Blocked</Badge>;
            case 'Pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Foydalanuvchilar</h1>
                    <p className="text-gray-500">Tizimdagi barcha ishtirokchilar boshqaruvi</p>
                </div>

                {/* Add User Dialog */}
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Yangi qo'shish
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yangi foydalanuvchi qo'shish</DialogTitle>
                            <DialogDescription>
                                Admin tomonidan qo'shilgan foydalanuvchiga SMS bormaydi. Ular parolni o'zlari tiklashi kerak.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ism Familiya</label>
                                <Input
                                    placeholder="Masalan: Azizbek T."
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefon raqam</label>
                                <Input
                                    placeholder="+998"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rol</label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rolni tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Student">Student (O'quvchi)</SelectItem>
                                        <SelectItem value="Teacher">Teacher (O'qituvchi)</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Bekor qilish</Button>
                            <Button onClick={handleAddUser}>Qo'shish</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* FILTERS TOOLBAR */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Ism, Telefon yoki ID orqali qidirish..."
                        className="pl-9 bg-gray-50 border-gray-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barcha Rollar</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Teacher">Teacher</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barcha Statuslar</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Blocked">Blocked</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                    </Button>
                </div>
            </div>

            {/* USERS TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Foydalanuvchi</TableHead>
                            <TableHead>Telefon (Login)</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Oxirgi kirish</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-gray-50/50">
                                <TableCell className="font-mono text-xs text-gray-500">{user.id}</TableCell>
                                <TableCell>
                                    <div className="font-bold text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.joined} da qo'shildi</div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium text-gray-700">{user.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            user.role === 'Teacher' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-gray-100 text-gray-700 border-gray-200'
                                        }`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(user.status)}
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {user.lastLogin}
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

                                            <DropdownMenuSeparator />

                                            {user.status === 'Blocked' ? (
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-green-600 focus:text-green-700 focus:bg-green-50"
                                                    onClick={() => handleStatusChange(user.id, 'Active')}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" /> Faollashtirish
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                                    onClick={() => handleStatusChange(user.id, 'Blocked')}
                                                    disabled={user.role === 'Admin'}
                                                >
                                                    <Ban className="w-4 h-4 mr-2" /> Bloklash
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Hech narsa topilmadi.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;
