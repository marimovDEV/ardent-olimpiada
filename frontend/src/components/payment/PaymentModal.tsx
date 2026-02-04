import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, CheckCircle, Loader2, Zap, Clock, Smartphone } from "lucide-react";
import { toast } from "sonner";
import api, { API_URL } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
    isOpen: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose?: () => void;
    onSuccess?: (newBalance?: number) => void;
    requiredAmount?: number;
}

const PaymentModal = ({ isOpen, onOpenChange, onClose, onSuccess, requiredAmount }: PaymentModalProps) => {
    const [amount, setAmount] = useState(requiredAmount ? requiredAmount.toString() : "50000");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'SELECT' | 'INSTRUCTION' | 'SUCCESS' | 'PENDING'>('SELECT');
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");

    // Update amount if requiredAmount changes
    useEffect(() => {
        if (requiredAmount) {
            setAmount(requiredAmount.toString());
        }
    }, [requiredAmount]);



    // Dynamic Payment Configuration
    const [activeType, setActiveType] = useState<string | null>(null);
    const [manualProvider, setManualProvider] = useState<any>(null);
    const [botProvider, setBotProvider] = useState<any>(null);
    const [loadingSettings, setLoadingSettings] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchConfiguration();
        }
    }, [isOpen]);

    const fetchConfiguration = async () => {
        setLoadingSettings(true);
        try {
            // Fetch Platform Settings
            const settingsRes = await api.get('/settings/platform/');
            let settings = settingsRes.data;

            // Handle Pagination
            if (settings.results && Array.isArray(settings.results)) {
                settings = settings.results[0];
            } else if (Array.isArray(settings)) {
                settings = settings[0];
            }

            if (settings && settings.active_payment_type) {
                setActiveType(settings.active_payment_type);
            }

            // Fetch Providers (Public/Auth accessible?)
            // If /settings/payment-providers/ is admin only, we might fail here.
            // But we made platform settings accessible. 
            // We should probably check if we can fetch payment providers.
            // If IsAdminUser is still strictly on PaymentProviderViewSet, this will fail for students.
            // For now, assuming we might need to fix PaymentProviderViewSet permission too or add public endpoint.
            // Let's try fetching.
            try {
                const providersRes = await api.get('/settings/payment-providers/');
                const providers = Array.isArray(providersRes.data) ? providersRes.data : providersRes.data.results || [];

                setManualProvider(providers.find((p: any) => p.type === 'MANUAL' && p.is_active));
                setBotProvider(providers.find((p: any) => p.type === 'BOT' && p.is_active));
            } catch (e) {
                console.warn("Could not fetch providers details", e);
            }

        } catch (error) {
            console.error("Configuration fetch error", error);
        } finally {
            setLoadingSettings(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (onOpenChange) onOpenChange(open);
        if (!open && onClose) onClose();
    };

    const handleInitiate = async (method: 'PAYME' | 'CLICK' | 'HUMO') => {
        const val = parseInt(amount);
        if (!val || val < 1000) {
            toast.error("Minimal summa: 1,000 UZS");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(`/payments/initiate/`, {
                amount: val,
                method: method,
                type: 'TOPUP',
                reference_id: 'wallet'
            });

            if (res.data.success) {
                setPaymentDetails(res.data);

                if (res.data.bot_url) {
                    window.open(res.data.bot_url, '_blank');
                    // Optionally set specific step for bot
                }

                setStep('INSTRUCTION');
            }
        } catch (error: any) {
            console.error("Payment Error:", error);
            toast.error(error.response?.data?.error || "To'lovda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'INSTRUCTION' && paymentDetails?.unique_amount_details?.expires_at) {
            const expireTime = new Date(paymentDetails.unique_amount_details.expires_at).getTime();

            interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = expireTime - now;

                if (distance < 0) {
                    clearInterval(interval);
                    setTimeLeft("EXPIRED");
                    // Optionally close or show error
                } else {
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, paymentDetails]);

    const reset = () => {
        setStep('SELECT');
        handleOpenChange(false);
    };

    const quickAmounts = ["10000", "50000", "150000", "500000"];

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md w-[95vw] sm:w-full p-0 overflow-hidden bg-slate-950 border-none rounded-[24px] sm:rounded-[32px] shadow-[0_0_50px_rgba(59,130,246,0.15)] ring-1 ring-white/10">
                <div className="relative p-4 sm:p-8">
                    {/* Background Neon Glows */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-[80px] -mr-20 -mt-20 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/20 blur-[80px] -ml-20 -mb-20 rounded-full" />

                    <DialogHeader className="relative z-10 space-y-2 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-2xl font-black text-white tracking-tight">Balansni to'ldirish</DialogTitle>
                                <DialogDescription className="text-slate-400 font-medium font-bold">1 ArdCoin = 1 so'm</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        {step === 'SELECT' ? (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8 relative z-10"
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">To'ldirish summasi (UZS)</Label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                                                UZS
                                            </div>
                                            <Input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                min="1000"
                                                className="h-16 pl-16 pr-4 bg-slate-900/50 border-slate-800 text-2xl font-black text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {quickAmounts.map((amt) => (
                                            <button
                                                key={amt}
                                                onClick={() => setAmount(amt)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${amount === amt
                                                    ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                                                    : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                                    }`}
                                            >
                                                {parseInt(amt).toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {loadingSettings ? (
                                        <div className="flex justify-center p-4">
                                            <Loader2 className="animate-spin opacity-50" />
                                        </div>
                                    ) : (
                                        <>
                                            {/* INTEGRATION MODE */}
                                            {activeType === 'INTEGRATION' && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleInitiate('PAYME')}
                                                        disabled={loading}
                                                        className="relative group h-28 rounded-3xl bg-slate-900/40 border border-slate-800/50 overflow-hidden transition-all hover:border-blue-500/50 hover:bg-slate-900/60"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 group-hover:to-blue-600/10 transition-colors" />
                                                        <div className="relative flex flex-col items-center justify-center gap-3">
                                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                <CreditCard className="w-6 h-6 text-blue-500" />
                                                            </div>
                                                            <span className="font-bold text-slate-200 tracking-wide text-sm">PAYME</span>
                                                        </div>
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handleInitiate('CLICK')}
                                                        disabled={loading}
                                                        className="relative group h-28 rounded-3xl bg-slate-900/40 border border-slate-800/50 overflow-hidden transition-all hover:border-blue-500/50 hover:bg-slate-900/60"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/5 group-hover:to-blue-600/10 transition-colors" />
                                                        <div className="relative flex flex-col items-center justify-center gap-3">
                                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                <Wallet className="w-6 h-6 text-blue-500" />
                                                            </div>
                                                            <span className="font-bold text-slate-200 tracking-wide text-sm">CLICK</span>
                                                        </div>
                                                    </motion.button>
                                                </div>
                                            )}

                                            {/* MANUAL MODE */}
                                            {activeType === 'MANUAL' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleInitiate('MANUAL')}
                                                    className="relative group h-32 rounded-3xl bg-slate-900/40 border border-slate-800/50 overflow-hidden transition-all hover:border-green-500/50 hover:bg-slate-900/60 w-full"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-green-600/5 group-hover:to-green-600/10 transition-colors" />
                                                    <div className="relative flex flex-col items-center justify-center gap-3 px-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <Smartphone className="w-6 h-6 text-green-500" />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="font-bold text-slate-200 tracking-wide block text-sm">KARTA ORQALI O'TKAZMA</span>
                                                            <span className="text-xs text-slate-500">Manual tasdiqlash</span>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            )}

                                            {/* BOT MODE */}
                                            {activeType === 'BOT' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        handleInitiate('USERBOT');
                                                    }}
                                                    className="relative group h-32 rounded-3xl bg-slate-900/40 border border-slate-800/50 overflow-hidden transition-all hover:border-orange-500/50 hover:bg-slate-900/60 w-full"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-orange-600/5 group-hover:to-orange-600/10 transition-colors" />
                                                    <div className="relative flex flex-col items-center justify-center gap-3 px-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <Smartphone className="w-6 h-6 text-orange-500" />
                                                        </div>
                                                        <span className="font-bold text-slate-200 tracking-wide text-sm">TELEGRAM ORQALI TO'LASH</span>
                                                        <span className="text-xs text-slate-500">Botga o'tish</span>
                                                    </div>
                                                </motion.button>
                                            )}

                                            {!activeType && (
                                                <div className="text-center text-slate-500">To'lov tizimi sozlanmagan</div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ) : step === 'INSTRUCTION' ? (
                            <motion.div
                                key="instruction"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 relative z-10 text-center"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">To'lovni amalga oshiring</h3>
                                    <p className="text-slate-400 text-sm">
                                        Iltimos, ushbu summani to'lov tizimi orqali o'tkazing.
                                    </p>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-sm text-slate-500 font-medium">To'lanadigan summa</div>
                                        <div className="text-4xl font-black text-blue-500 tracking-tight">
                                            {parseInt(paymentDetails?.unique_amount_details?.final || amount).toLocaleString()} <span className="text-base text-slate-400">UZS</span>
                                        </div>
                                    </div>

                                    {paymentDetails?.unique_amount_details?.unique_add > 0 && (
                                        <>
                                            <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-800">
                                                <span className="text-slate-500">Asl summa:</span>
                                                <span className="font-mono text-slate-300">{parseInt(paymentDetails?.unique_amount_details?.original).toLocaleString()} UZS</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500">Unikal kod (qo'shilgan):</span>
                                                <span className="font-mono text-green-500">+{paymentDetails?.unique_amount_details?.unique_add} so'm</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-2 text-orange-500 font-medium bg-orange-500/10 py-2 rounded-lg">
                                    <Clock className="w-4 h-4" />
                                    <span>To'lash vaqti: {timeLeft}</span>
                                </div>

                                <div className="space-y-3">
                                    {paymentDetails?.pay_url && (
                                        <Button
                                            onClick={() => window.open(paymentDetails.pay_url, '_blank')}
                                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl"
                                        >
                                            To'lov Sahifasiga O'tish
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            if (paymentDetails?.method === 'USERBOT' || paymentDetails?.method === 'MANUAL') {
                                                setStep('PENDING');
                                            } else {
                                                setStep('SUCCESS');
                                            }
                                        }}
                                        className="w-full border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                                    >
                                        To'ladim, tekshirish
                                    </Button>
                                </div>
                            </motion.div>
                        ) : step === 'PENDING' ? (
                            <motion.div
                                key="pending"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 text-center py-4"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                                    <div className="relative w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center ring-4 ring-blue-500/10 mx-auto">
                                        <Clock className="w-12 h-12 text-blue-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white tracking-tight">Qabul qilindi!</h3>
                                    <p className="text-slate-400 font-medium">To'lov administrator tomonidan tekshirilmoqda. Tasdiqlanganidan so'ng hisobingizga coinlar qo'shiladi.</p>
                                </div>
                                <Button onClick={reset} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold border border-slate-800 transition-all">
                                    Tushunarli
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 text-center py-4"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse" />
                                    <div className="relative w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center ring-4 ring-green-500/10 mx-auto">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-2 mx-auto">
                                    <h3 className="text-2xl font-black text-white tracking-tight">Muvaffaqiyatli!</h3>
                                    <p className="text-slate-400 font-medium">To'lov qabul qilindi va hisobingiz yangilandi.</p>
                                </div>
                                <Button onClick={reset} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold border border-slate-800 transition-all">
                                    Yopish
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 rounded-[32px]"
                        >
                            <div className="text-center space-y-4">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-500 opacity-20" />
                                    <Zap className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-white text-lg tracking-tight">Bajarilmoqda...</p>
                                    <p className="text-slate-500 text-sm">Bog'lanish o'rnatilmoqda</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default PaymentModal;
