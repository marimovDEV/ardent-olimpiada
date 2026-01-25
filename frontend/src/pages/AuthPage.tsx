import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";

interface AuthPageProps {
  mode: 'login' | 'register' | 'recover';
}

const AuthPage = ({ mode }: AuthPageProps) => {
  // Form States
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Password/Reset
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Logic States
  const [isLocked, setIsLocked] = useState(false); // Only for SMS flows (Register/Recover step 2)
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Reset state when mode changes
  useEffect(() => {
    setStep(1);
    setPhone("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setIsLocked(false);
    setResendTimer(0);
  }, [mode]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const formatPhone = (value: string) => {
    return value.replace(/[^0-9]/g, '');
  };

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  // HANDLERS

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      toast({ title: "Xatolik", description: "Iltimos, to'g'ri telefon raqam kiriting", variant: "destructive" });
      return;
    }

    if (mode === 'login') {
      // Login Flow: Direct to Password logic check (simulated here)
      // In real app, we check if user exists. If yes, check password.
      // Here we just simulate "User found, enter password"
      // But actually Login flow Step 1 is Phone+Password in one screen usually, or Phone -> Password.
      // Let's stick to the layout where Login is Phone + Password fields visible at once for UX speed if possible, 
      // OR if we want to follow step pattern: Phone -> Password.
      // The user said: "Login Flow: 1. Phone 2. Password 3. Login". 
      // Let's allow step 2 for login to be password entry.
      // BUT, modern UX often shows both. Let's stick to user request: Step 1 Phone -> Step 2 Password.
      setStep(2);
    } else {
      // Register/Recover Flow: Send SMS
      toast({ title: "SMS yuborildi", description: "Tasdiqlash kodi: 123456" });
      setStep(2);
      setIsLocked(true);
      setResendTimer(59);
    }
  };

  const handleLoginFullSubmit = (e: React.FormEvent) => {
    // Alternative Login: If we want both fields at once.
    // But let's implement the stepped approach as per "Flow" description if strictly needed.
    // Actually, user said "Flow: 1. Phone 2. Password 3. Login". 
    // This implies we can just have them on one form or 2 steps.
    // Let's do 2 steps for consistent UI, or one form if step is 1.
    e.preventDefault();
    navigate("/dashboard");
    toast({ title: "Xush kelibsiz!", description: "Tizimga muvaffaqiyatli kirdingiz." });
  }

  const handleChangeNumber = () => {
    setStep(1);
    setIsLocked(false);
    setOtp("");
    setResendTimer(0);
  };

  const handleResendSms = () => {
    toast({ title: "SMS qayta yuborildi", description: "Yangi kod: 123456" });
    setResendTimer(59);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456") {
      toast({ title: "Xatolik", description: "Kod noto'g'ri", variant: "destructive" });
      return;
    }
    setStep(3); // Go to Password Creation (Register) or New Password (Recover)
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast({ title: "Xatolik", description: "Parol talablarga javob bermaydi", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Xatolik", description: "Parollar mos kelmadi", variant: "destructive" });
      return;
    }

    navigate("/dashboard");
    const msg = mode === 'register' ? "Hisob yaratildi!" : "Parol yangilandi!";
    toast({ title: "Muvaffaqiyatli", description: msg });
  };

  // RENDER HELPERS
  const getPageTitle = () => {
    if (isLocked) return step === 2 ? "Kodni tasdiqlang" : "Parol o'rnating";
    switch (mode) {
      case 'login': return "Xush kelibsiz!";
      case 'register': return "Kelajagingizni boshlang";
      case 'recover': return "Parolni tiklash";
    }
  };

  const getPageSubtitle = () => {
    if (isLocked) return step === 2 ? `+998 ${phone} raqamiga kod yuborildi` : "Yangi xavfsiz parol o'ylab toping";
    switch (mode) {
      case 'login': return "Tizimga kirish uchun ma'lumotlarni kiriting";
      case 'register': return "1 daqiqada bepul hisob yarating";
      case 'recover': return "Telefon raqamingizni kiriting";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">

        {/* Back Link - Hidden if Locked */}
        {!isLocked && (
          <div className="absolute top-8 left-8">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Bosh sahifa
            </Link>
          </div>
        )}

        <div className="w-full max-w-md animate-slide-up">

          {/* Header */}
          <div className="text-center mb-8">
            {!isLocked && (
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">Ardent</span>
              </Link>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            <p className="text-gray-500">{getPageSubtitle()}</p>
          </div>

          {/* Mode Tabs - only visible if NOT locked and NOT recover */}
          {!isLocked && mode !== 'recover' && (
            <div className="bg-gray-100/80 p-1 rounded-2xl flex mb-8">
              <Link to="/auth/register" className={`flex-1`}>
                <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  Ro'yxatdan o'tish
                </button>
              </Link>
              <Link to="/auth/login" className={`flex-1`}>
                <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  Kirish
                </button>
              </Link>
            </div>
          )}

          {/* CONTENT */}

          {/* STEP 1: PHONE (Common) */}
          {step === 1 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telefon raqam</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+998</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="90 123 45 67"
                    className="w-full h-14 pl-16 pr-4 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-lg"
                    autoFocus
                  />
                </div>
                {mode === 'register' && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-600 font-medium bg-green-50 w-fit px-2 py-1 rounded-lg">
                    <ShieldCheck className="w-3 h-3" />
                    SMS butunlay bepul.
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className={`w-full h-14 font-bold rounded-xl shadow-lg ${mode === 'register' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-gray-900 hover:bg-gray-800'}`}>
                {mode === 'register' ? "Bepul ro'yxatdan o'tish" : (mode === 'recover' ? "Kodni olish" : "Davom etish")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {mode === 'login' && (
                <div className="text-center">
                  <Link to="/auth/recover" className="text-sm font-medium text-blue-600 hover:underline">
                    Parolni unutdingizmi?
                  </Link>
                </div>
              )}
            </form>
          )}

          {/* STEP 2: OTP (Register/Recover only) OR PASSWORD (Login) */}
          {step === 2 && (
            mode === 'login' ? (
              // LOGIN STEP 2: PASSWORD
              <form onSubmit={handleLoginFullSubmit} className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Parol</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Parolingizni kiriting"
                      className="w-full h-14 pl-12 pr-12 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link to="/auth/recover" className="text-sm font-medium text-blue-600 hover:underline">
                      Parolni unutdingizmi?
                    </Link>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl">
                  Tizimga kirish
                </Button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-500 hover:text-gray-900">
                  Raqamni o'zgartirish (<strong>{phone}</strong>)
                </button>
              </form>
            ) : (
              // REGISTER/RECOVER STEP 2: OTP
              <form onSubmit={handleOtpSubmit} className="space-y-8 animate-fade-in">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-14 w-12 text-lg border-gray-200" />
                      <InputOTPSlot index={1} className="h-14 w-12 text-lg border-gray-200" />
                      <InputOTPSlot index={2} className="h-14 w-12 text-lg border-gray-200" />
                    </InputOTPGroup>
                    <div className="w-4" />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="h-14 w-12 text-lg border-gray-200" />
                      <InputOTPSlot index={4} className="h-14 w-12 text-lg border-gray-200" />
                      <InputOTPSlot index={5} className="h-14 w-12 text-lg border-gray-200" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="text-center text-sm">
                  {resendTimer > 0 ? (
                    <span className="text-gray-400 font-medium flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      Kodni qayta yuborish: 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                    </span>
                  ) : (
                    <button type="button" onClick={handleResendSms} className="text-blue-600 hover:underline font-bold">
                      Kodni qayta yuborish
                    </button>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200">
                  Tasdiqlash
                </Button>

                <button type="button" onClick={handleChangeNumber} className="w-full text-center text-sm text-gray-500 hover:text-gray-900">
                  Raqamni o'zgartirish
                </button>
              </form>
            )
          )}

          {/* STEP 3: CREATE/RESET PASSWORD (Register/Recover) */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {mode === 'recover' ? "Yangi parol" : "Parol o'rnating"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kamida 8 ta belgi"
                    className="w-full h-14 pl-12 pr-12 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                <div className="mt-2 text-xs flex gap-3">
                  <span className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-600" : "text-gray-400"}`}>
                    <CheckCircle2 className="w-3 h-3" /> 8+ belgi
                  </span>
                  <span className={`flex items-center gap-1 ${(/[a-zA-Z]/.test(password) && /[0-9]/.test(password)) ? "text-green-600" : "text-gray-400"}`}>
                    <CheckCircle2 className="w-3 h-3" /> Harf va raqam
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Parolni takrorlang</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Parolni qayta kiriting"
                    className="w-full h-14 pl-12 pr-12 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200">
                {mode === 'recover' ? "Parolni yangilash" : "Hisob yaratish"}
              </Button>
            </form>
          )}

        </div>
      </div>

      {/* Right Side - Visual */}
      <div className={`hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-12 text-center transition-colors duration-500 ${mode === 'register' ? 'bg-blue-600' : (mode === 'recover' ? 'bg-gray-800' : 'bg-gray-900')}`}>
        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8 border border-white/10 backdrop-blur-md">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            {mode === 'register' ? "G'oliblar safida bo'ling" : (mode === 'recover' ? "Xavfsizlik birinchi o'rinda" : "Qaytganingizdan xursandmiz")}
          </h2>
          <p className="text-xl text-white/80 leading-relaxed">
            {mode === 'register'
              ? "Bizning platformada 2024-yilda 500+ o'quvchi xalqaro olimpiada sovrindori bo'ldi."
              : "Ilm olishda davom eting va yangi cho'qqilarni zabt eting."}
          </p>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
      </div>
    </div>
  );
};

export default AuthPage;
