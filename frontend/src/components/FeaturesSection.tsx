import { Video, FileCheck, Trophy, Award, BarChart3, Shield, Clock, Smartphone } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Video darslar",
    description: "Professional o'qituvchilar tomonidan tayyorlangan 10-15 daqiqali video darslar",
    color: "primary",
  },
  {
    icon: FileCheck,
    title: "Interaktiv testlar",
    description: "Bilimni mustahkamlash uchun har bir darsdan keyin test topshiring",
    color: "secondary",
  },
  {
    icon: Trophy,
    title: "Online olimpiadalar",
    description: "Pullik olimpiadalarda qatnashib, o'z kuchingizni sinab ko'ring",
    color: "warning",
  },
  {
    icon: Award,
    title: "Sertifikatlar",
    description: "QR-kod bilan tasdiqlangan rasmiy sertifikatlar oling",
    color: "accent",
  },
  {
    icon: BarChart3,
    title: "Reyting tizimi",
    description: "Fan va umumiy reyting orqali progressingizni kuzating",
    color: "success",
  },
  {
    icon: Shield,
    title: "Adolatli baholash",
    description: "Anti-cheating tizimi va randomizatsiya orqali adolatli test",
    color: "primary",
  },
  {
    icon: Clock,
    title: "Timer tizimi",
    description: "Vaqtga bog'liq testlar orqali haqiqiy olimpiada tajribasi",
    color: "secondary",
  },
  {
    icon: Smartphone,
    title: "Mobile-first",
    description: "Telefon va planshetda qulay ishlash imkoniyati",
    color: "accent",
  },
];

const FeaturesSection = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Imkoniyatlar
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Nima uchun bizni <span className="text-secondary">tanlashadi?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Platformamiz o'quvchilar va ota-onalar uchun eng qulay va samarali ta'lim muhitini taqdim etadi
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl md:rounded-3xl p-6 shadow-card hover:shadow-strong transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
