import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
import {
  Trophy,
  Clock,
  Users,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Award,
  Timer,
  ArrowRight,
  Play
} from "lucide-react";

const OlympiadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [isPaid, setIsPaid] = useState(false); // Simulation state

  const handlePayment = () => {
    // Simulate payment process
    toast({
      title: "To'lov amalga oshirilyapti...",
      description: "Iltimos kuting",
    });

    setTimeout(() => {
      setIsPaid(true);
      toast({
        title: "Muvaffaqiyatli!",
        description: "Siz olimpiadaga ro'yxatdan o'tdingiz via Click",
      });
    }, 1500);
  };

  const handleStart = () => {
    navigate("/test");
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/olympiads"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Olimpiadalarga qaytish
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero */}
            <div className="rounded-2xl gradient-primary p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6bTAgMGMwIDItMiA0LTIgNHMtMi0yLTItNC0yLTQgMi00IDIgMiAyIDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                      Pro daraja
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Matematika Respublika Olimpiadasi</h1>
                <p className="text-white/80">
                  O'zbekiston bo'ylab eng kuchli matematiklar uchun raqobatli olimpiada
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-card text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-bold">20-yanvar</div>
                <div className="text-sm text-muted-foreground">Sana</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-card text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <div className="font-bold">10:00</div>
                <div className="text-sm text-muted-foreground">Boshlanish</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-card text-center">
                <Timer className="w-6 h-6 mx-auto mb-2 text-warning" />
                <div className="font-bold">3 soat</div>
                <div className="text-sm text-muted-foreground">Davomiylik</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-card text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="font-bold">847/1000</div>
                <div className="text-sm text-muted-foreground">Ishtirokchilar</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-xl font-bold mb-4">Olimpiada haqida</h2>
              <p className="text-muted-foreground mb-6">
                Bu olimpiada O'zbekiston bo'ylab maktab o'quvchilari uchun o'tkaziladi.
                Olimpiadada algebra, geometriya va mantiqiy masalalar bo'ladi.
                Eng yaxshi natija ko'rsatgan 50 nafar ishtirokchi sertifikat va sovg'alar oladi.
              </p>

              <h3 className="font-bold mb-3">Mavzular:</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Algebraik tenglamalar va tengsizliklar
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Geometrik masalalar
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Kombinatorika va ehtimollik
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Mantiqiy masalalar
                </li>
              </ul>

              <h3 className="font-bold mb-3">Sovg'alar:</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-warning/10">
                  <Award className="w-8 h-8 mx-auto mb-2 text-warning" />
                  <div className="font-bold">1-o'rin</div>
                  <div className="text-sm text-muted-foreground">500,000 so'm</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted">
                  <Award className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="font-bold">2-o'rin</div>
                  <div className="text-sm text-muted-foreground">300,000 so'm</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-accent/10">
                  <Award className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="font-bold">3-o'rin</div>
                  <div className="text-sm text-muted-foreground">150,000 so'm</div>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Qoidalar va shartlar
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Olimpiada vaqtida boshqa tab yoki ilovaga o'tish taqiqlanadi. 3 marta ogohlantirishdan keyin olimpiada avtomatik yakunlanadi.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Savollarni ketma-ket javob berish kerak. Oldingi savolga qaytish imkoni yo'q.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Har bir savol uchun alohida vaqt limiti belgilangan.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Natijalar olimpiada yakunlangandan so'ng 24 soat ichida e'lon qilinadi.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-8">
              <div className="text-center mb-6">
                {isPaid ? (
                  <div className="text-3xl font-bold text-success flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-8 h-8" />
                    To'landi
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-bold gradient-text">50,000</div>
                    <div className="text-muted-foreground">so'm</div>
                  </>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Fan</span>
                  <span className="font-medium">Matematika</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Daraja</span>
                  <span className="font-medium">Pro</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Savollar</span>
                  <span className="font-medium">30 ta</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Til</span>
                  <span className="font-medium">O'zbek</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Ro'yxatdan o'tganlar</span>
                  <span className="font-bold text-primary">847/1000</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full" style={{ width: '84.7%' }} />
                </div>
              </div>

              {!isPaid ? (
                <>
                  {/* Agreement */}
                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-5 h-5 rounded mt-0.5 accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      Olimpiada qoidalari va shartlarini o'qidim va roziman
                    </span>
                  </label>

                  <Button
                    variant="hero"
                    className="w-full"
                    size="lg"
                    disabled={!agreed}
                    onClick={handlePayment}
                  >
                    <Trophy className="w-5 h-5" />
                    To'lov qilish
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Click yoki Payme orqali to'lov
                  </p>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-xl text-center text-sm mb-4">
                    Olimpiada boshlanishiga kuting.
                  </div>
                  <Button
                    variant="hero"
                    className="w-full"
                    size="lg"
                    onClick={handleStart}
                  >
                    <Play className="w-5 h-5" />
                    Olimpiadani Boshlash
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OlympiadDetailPage;
