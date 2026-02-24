import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
    User, Award, Zap, Camera, ArrowLeft, Loader2, CheckCircle, XCircle,
    BookOpen, CreditCard, ChevronRight, Settings, LogOut, HelpCircle, Trophy, Calendar
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { API_URL, getAuthHeader } from "@/services/api";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageCropper from "@/components/common/ImageCropper";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Types ---
interface UserData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar: string | null;
    role: string;
    xp: number;
    level: number;
    birth_date?: string;
    region?: string;
    school?: string;
    grade?: string;
    balance?: string;
    ranking?: number;
    certificates_count?: number;
    level_progress?: {
        current: number;
        next: number;
        xp_current: number;
        xp_next: number;
        xp_left: number;
        progress_percent: number;
    };
}

interface Course {
    id: number;
    title: string;
    subject: string;
    level: string;
    lessons_count: number;
    duration: string;
    enrolled_count: number;
    rating: number;
    thumbnail: string;
    is_free: boolean;
    price: number;
    description: string;
    teacher_name?: string;
}

interface Enrollment {
    id: number;
    course: Course;
    enrolled_at: string;
    progress: number;
    is_completed: boolean;
}

const REGIONS = [
    "Toshkent shahri", "Toshkent viloyati", "Andijon viloyati", "Buxoro viloyati",
    "Farg'ona viloyati", "Jizzax viloyati", "Xorazm viloyati", "Namangan viloyati",
    "Navoiy viloyati", "Qashqadaryo viloyati", "Qoraqalpog'iston", "Samarqand viloyati",
    "Sirdaryo viloyati", "Surxondaryo viloyati",
];

const GRADES = [
    { value: "5", label: "5-sinf" }, { value: "6", label: "6-sinf" },
    { value: "7", label: "7-sinf" }, { value: "8", label: "8-sinf" },
    { value: "9", label: "9-sinf" }, { value: "10", label: "10-sinf" },
    { value: "11", label: "11-sinf" }, { value: "STUDENT", label: "Talaba" },
    { value: "GRADUATE", label: "Bitiruvchi" },
];

// --- TopUp Component ---
const TopUpDialog = ({ onSuccess }: { onSuccess: () => void }) => {
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('PAYME');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleTopUp = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) < 1000) {
            toast({ title: "Xatolik", description: "Minimal summa 1000 so'm", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/payments/initiate/`, {
                type: 'TOPUP', amount: Number(amount), method, reference_id: 'wallet_topup'
            }, { headers: getAuthHeader() });

            if (res.data.success && res.data.payment_url) {
                window.location.href = res.data.payment_url;
            }
        } catch (err) {
            toast({ title: "Xatolik", description: "Xatolik yuz berdi", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center justify-between px-4 h-14 border-b border-border/50 bg-card cursor-pointer hover:bg-muted/50 transition active:scale-[0.98]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">To'lovlar / Hisobni to'ldirish</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border border-border">
                <DialogHeader>
                    <DialogTitle>Hisobni to'ldirish</DialogTitle>
                    <DialogDescription>To'lov tizimini tanlang va summani kiriting.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>To'lov tizimi</Label>
                        <RadioGroup defaultValue="PAYME" value={method} onValueChange={setMethod} className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="PAYME" id="payme" className="peer sr-only" />
                                <Label htmlFor="payme" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer">
                                    <span className="text-lg font-bold">Payme</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="CLICK" id="click" className="peer sr-only" />
                                <Label htmlFor="click" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer">
                                    <span className="text-lg font-bold">Click</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label>Summa (UZS)</Label>
                        <Input type="number" placeholder="Masalan: 50000" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-xl h-11" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleTopUp} disabled={loading} className="w-full bg-primary text-background hover:bg-primary/90 rounded-xl font-bold h-12 shadow-primary/20">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        To'lashga o'tish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- Profile Edit Component ---
const EditProfileDialog = ({ user, onClose, onSave }: { user: UserData, onClose: () => void, onSave: (u: UserData) => void }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(user.username || '');
    const [firstName, setFirstName] = useState(user.first_name || '');
    const [lastName, setLastName] = useState(user.last_name || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [birthDate, setBirthDate] = useState(user.birth_date || '');
    const [region, setRegion] = useState(user.region || '');
    const [school, setSchool] = useState(user.school || '');
    const [grade, setGrade] = useState(user.grade || '');
    const { toast } = useToast();

    // Username validation
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

    const checkUsername = async (newUsername: string) => {
        if (!newUsername || newUsername.length < 3 || newUsername === user.username) return;
        setUsernameStatus('checking');
        try {
            const res = await fetch(`${API_URL}/auth/check-username/?username=${newUsername}`);
            const data = await res.json();
            setUsernameStatus(data.available ? 'available' : 'taken');
        } catch {
            setUsernameStatus('available');
        }
    };

    const handleSave = async () => {
        if (usernameStatus === 'taken') {
            toast({ title: t('dashboard.profile.info.error'), description: t('dashboard.profile.info.usernameTaken'), variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.put(`${API_URL}/auth/profile/`, {
                username, first_name: firstName, last_name: lastName, phone,
                birth_date: birthDate || null, region, school, grade
            }, { headers: getAuthHeader() });

            if (res.data.success) {
                onSave({ ...user, ...res.data.user });
                toast({ title: t('dashboard.profile.info.saved') });
                onClose();
            }
        } catch (err: any) {
            toast({ title: t('dashboard.profile.info.error'), description: err.response?.data?.error || "Error", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed flex inset-0 z-50 bg-background/80 backdrop-blur-sm pt-14 lg:pt-0 overflow-y-auto w-full h-full">
            <div className="m-auto w-full max-w-lg bg-card rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
                <div className="p-4 border-b flex justify-between items-center bg-card sticky top-0 z-10">
                    <h2 className="font-bold text-lg">Profilni tahrirlash</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><XCircle className="w-5 h-5" /></Button>
                </div>
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                            <input type="text" value={username} onChange={(e) => { const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''); setUsername(val); if (val.length >= 3) checkUsername(val); else setUsernameStatus('idle'); }} className={`w-full h-11 pl-8 pr-10 rounded-xl border bg-background focus:ring-1 focus:ring-primary outline-none transition-all ${usernameStatus === 'taken' ? 'border-red-500' : 'border-border'}`} />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
                                {usernameStatus === 'available' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                {usernameStatus === 'taken' && <XCircle className="w-4 h-4 text-red-500" />}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Ism</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-border bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="Ism" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Familiya</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-border bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="Familiya" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Telefon</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-border bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="+998" />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Viloyat</label>
                        <Select value={region || ""} onValueChange={setRegion}>
                            <SelectTrigger className="w-full h-11 rounded-xl bg-background border-border">
                                <SelectValue placeholder="Viloyatni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                {REGIONS.map(r => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Sinf</label>
                            <Select value={grade || ""} onValueChange={setGrade}>
                                <SelectTrigger className="w-full h-11 rounded-xl bg-background border-border">
                                    <SelectValue placeholder="Sinf tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GRADES.map(g => (<SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Maktab / OTM</label>
                            <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-border bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="Maktab qismi" />
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t bg-muted/20">
                    <Button onClick={handleSave} disabled={isLoading || usernameStatus === 'taken'} className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90">
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        Saqlash
                    </Button>
                </div>
            </div>
        </div>
    )
}

// --- Main Profile Page Component ---

const ProfilePage = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState<UserData | null>(null);
    const [activeCourse, setActiveCourse] = useState<Enrollment | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Avatar states
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        loadUser();
        fetchActiveCourse();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await axios.get(`${API_URL}/auth/me/`, { headers: getAuthHeader() });
                if (res.data.success && res.data.user) {
                    updateLocalUser(res.data.user);
                }
            } catch (err) {
                console.error('Error fetching user from API');
            }
        }
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                updateLocalUser(userData);
            } catch (e) {
                console.error('Error parsing user data');
            }
        }
    };

    const updateLocalUser = (userData: UserData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setAvatarPreview(userData.avatar || null);
    };

    const fetchActiveCourse = async () => {
        try {
            const res = await axios.get(`${API_URL}/courses/my_courses/`, { headers: getAuthHeader() });
            if (res.data.success && res.data.enrollments && res.data.enrollments.length > 0) {
                // Find highest progress that is not 100%, or just the first course
                const inProgress = res.data.enrollments.find((e: Enrollment) => !e.is_completed);
                setActiveCourse(inProgress || res.data.enrollments[0]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = async (croppedFile: File) => {
        const formData = new FormData();
        formData.append('avatar', croppedFile);
        try {
            const res = await axios.post(`${API_URL}/auth/upload-avatar/`, formData, {
                headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.avatar_url && user) {
                updateLocalUser({ ...user, avatar: res.data.avatar_url });
            }
        } catch (err) {
            toast({ title: "Xatolik", description: "Avatar yuklashda xatolik yuz berdi", variant: "destructive" });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[100dvh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
    const initials = (user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase();
    const displayAvatar = avatarPreview || user.avatar;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background pb-20 selection:bg-primary/30 w-full animate-fade-in lg:mt-6 overflow-x-hidden md:max-w-xl md:mx-auto lg:max-w-3xl border-x border-border/10">
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />

            {editMode && <EditProfileDialog user={user} onClose={() => setEditMode(false)} onSave={updateLocalUser} />}

            {/* 1. Fixed Top Header (Mobile) */}
            <header className="fixed top-0 w-full bg-white dark:bg-card/80 backdrop-blur-xl h-14 flex items-center justify-between px-4 border-b border-border/50 z-40 lg:hidden">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-foreground active:scale-95 transition">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="font-bold text-lg">Profil</h1>
                <button onClick={() => navigate('/settings')} className="p-2 -mr-2 text-muted-foreground hover:text-foreground active:scale-95 transition">
                    <Settings className="w-5 h-5" />
                </button>
            </header>

            {/* Content Wrapper */}
            <div className="p-4 space-y-4 pt-[72px] lg:pt-4">
                {/* 2. Profile Card */}
                <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm border border-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>

                    <div className="relative flex items-center gap-4">
                        <div className="relative" onClick={() => fileInputRef.current?.click()}>
                            {displayAvatar ? (
                                <img src={displayAvatar} alt={fullName} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 bg-muted" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FACC15] to-[#CA8A04] flex items-center justify-center text-xl font-bold border-2 border-primary/20 text-white shadow-md">
                                    {initials}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-background rounded-full flex items-center justify-center border-2 border-white dark:border-card shadow-sm active:scale-90 transition cursor-pointer">
                                <Camera className="w-3 h-3" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-black truncate">{fullName}</h2>
                            <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                            <div className="flex items-center gap-2 mt-1 -ml-1">
                                <Badge variant="secondary" className="scale-90 text-[10px] bg-primary/10 text-primary border-0 font-bold uppercase tracking-wider">Lvl {user.level || 1}</Badge>
                                {(user.certificates_count ?? 0) > 0 && (
                                    <span className="flex items-center text-xs font-semibold text-yellow-500">
                                        <Trophy className="w-3 h-3 mr-0.5" /> {user.certificates_count} ta
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="text-muted-foreground">Umumiy progress</span>
                            <span className="text-primary">{user.level_progress?.progress_percent || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                                style={{ width: `${user.level_progress?.progress_percent || 0}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 tracking-wider text-right">Keyingi darajagacha {user.level_progress?.xp_left || 0} XP</p>
                    </div>
                </div>

                {/* 3. Quick Stats Row */}
                <div className="grid grid-cols-3 text-center divide-x divide-border mt-4 bg-white dark:bg-card rounded-2xl py-4 shadow-sm border border-border">
                    <div className="flex flex-col items-center justify-center px-2">
                        <span className="text-lg font-black text-foreground mb-0.5">{activeCourse ? 1 : 0}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Kurslar</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-2">
                        <span className="text-lg font-black text-foreground mb-0.5">{user.certificates_count || 0}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Sertifikat</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-2">
                        <span className="text-lg font-black text-foreground mb-0.5">{user.xp || 0}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Soat (XP)</span>
                    </div>
                </div>

                {/* 4. Primary Action Button */}
                <Button
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm shadow-indigo-500/20 active:scale-[0.98] transition-all text-base mt-2"
                    onClick={() => {
                        if (activeCourse) navigate(`/course/${activeCourse.course.id}`);
                        else navigate('/courses');
                    }}
                >
                    {activeCourse ? "Davom ettirish" : "Kurslarni ko'rish"}
                </Button>

                {/* 5. Active Course Card (Only if enrolled) */}
                {activeCourse && (
                    <div
                        onClick={() => navigate(`/course/${activeCourse.course.id}`)}
                        className="bg-white dark:bg-card mt-4 rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4 cursor-pointer active:scale-[0.98] transition"
                    >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
                            {activeCourse.course.thumbnail ? (
                                <img src={activeCourse.course.thumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm truncate">{activeCourse.course.title}</h3>
                            <div className="flex items-center justify-between mb-1 mt-1">
                                <span className="text-[10px] text-muted-foreground">Progress</span>
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{activeCourse.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${activeCourse.progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. Secondary Menu List */}
                <div className="bg-white dark:bg-card mt-4 rounded-2xl overflow-hidden shadow-sm border border-border divide-y divide-border">
                    <div onClick={() => setEditMode(true)} className="flex items-center justify-between px-4 h-14 cursor-pointer hover:bg-muted/50 transition active:scale-[0.98]">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Profilni tahrirlash</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                    </div>

                    <div onClick={() => navigate('/my-certificates')} className="flex items-center justify-between px-4 h-14 cursor-pointer hover:bg-muted/50 transition active:scale-[0.98]">
                        <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Sertifikatlar</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                    </div>

                    <div onClick={() => navigate('/olympiads')} className="flex items-center justify-between px-4 h-14 cursor-pointer hover:bg-muted/50 transition active:scale-[0.98]">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Olimpiadalar</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                    </div>

                    <TopUpDialog onSuccess={loadUser} />

                    <div onClick={() => window.open('https://t.me/Ardent_support_bot', '_blank')} className="flex items-center justify-between px-4 h-14 cursor-pointer hover:bg-muted/50 transition active:scale-[0.98]">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Yordam</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                    </div>

                    <div onClick={handleLogout} className="flex items-center justify-between px-4 h-14 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition active:scale-[0.98] text-red-600">
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Chiqish</span>
                        </div>
                    </div>
                </div>

                {/* Spacer block to allow scrolling down past the bottom nav */}
                <div className="h-20"></div>
            </div>

            {imageToCrop && (
                <ImageCropper
                    image={imageToCrop}
                    open={showCropper}
                    onOpenChange={setShowCropper}
                    aspect={1}
                    onCropComplete={(croppedFile) => handleAvatarUpload(croppedFile)}
                />
            )}
        </div>
    );
};

export default ProfilePage;
