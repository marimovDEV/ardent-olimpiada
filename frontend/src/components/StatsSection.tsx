import { Users, BookOpen, Trophy, Award, TrendingUp, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Faol o'quvchilar",
    description: "Har oy yangi foydalanuvchilar qo'shilmoqda",
    color: "primary",
  },
  {
    icon: BookOpen,
    value: "500+",
    label: "Video darslar",
    description: "Professional o'qituvchilar tomonidan",
    color: "secondary",
  },
  {
    icon: Trophy,
    value: "150+",
    label: "O'tkazilgan olimpiadalar",
    description: "Turli fan yo'nalishlari bo'yicha",
    color: "warning",
  },
  {
    icon: Award,
    value: "5,000+",
    label: "Berilgan sertifikatlar",
    description: "QR-kod bilan tasdiqlangan",
    color: "accent",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Statistika
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Bizning <span className="gradient-text">yutuqlarimiz</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Platformamizning o'sishi va foydalanuvchilarimizning yutuqlari
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-card hover:shadow-strong transition-all duration-300 hover:-translate-y-1 text-center animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-${stat.color}/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-8 h-8 md:w-10 md:h-10 text-${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-extrabold mb-2 gradient-text">
                {stat.value}
              </div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground hidden md:block">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12 md:mt-16">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 text-warning fill-warning" />
            ))}
          </div>
          <span className="text-muted-foreground text-center">
            <span className="font-bold text-foreground">4.9/5</span> reyting • 2,500+ sharhlar asosida
          </span>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
