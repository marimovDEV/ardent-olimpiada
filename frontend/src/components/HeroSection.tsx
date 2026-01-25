import { Button } from "@/components/ui/button";
import { Trophy, Play, Star, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-20 md:pt-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-20 -left-20 w-72 h-72 md:w-[400px] md:h-[400px] rounded-full bg-purple-500/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-80 h-80 md:w-[600px] md:h-[600px] rounded-full bg-secondary/20 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-8 md:py-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">#1 Ta'lim Platformasi</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-xy bg-[length:200%_auto]">Olimpiadalarga</span>
              <br />
              <span className="text-foreground">Tayyorlan va </span>
              <span className="text-secondary">G'olib</span>
              <br />
              <span className="text-foreground">Bo'l!</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Video darslar, testlar va olimpiadalar orqali bilimingizni oshiring.
              Reyting tizimi va sertifikatlar bilan yutuqlaringizni tasdiqlang!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link to="/auth">
                <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                  <Trophy className="w-6 h-6 group-hover:animate-bounce-subtle" />
                  Olimpiadaga qo'shilish
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="glass" size="xl" className="w-full sm:w-auto">
                  <Play className="w-6 h-6" />
                  Bepul darslarni ko'rish
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">O'quvchilar</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-secondary">500+</div>
                <div className="text-sm text-muted-foreground">Video darslar</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-warning">50+</div>
                <div className="text-sm text-muted-foreground">Olimpiadalar</div>
              </div>
            </div>
          </div>

          {/* Right content - Hero illustration */}
          <div className="flex-1 relative animate-fade-in">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main card */}
              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-strong">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-button">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Matematika Olimpiadasi</h3>
                    <p className="text-sm text-muted-foreground">Boshlash: 15-yanvar</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Ro'yxatdan o'tganlar</span>
                      <span className="text-primary font-bold">847/1000</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: '84.7%' }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center"
                        >
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-primary border-2 border-card flex items-center justify-center text-xs text-primary-foreground font-bold">
                        +84
                      </div>
                    </div>
                    <Link to="/auth">
                      <Button variant="secondary" size="sm">
                        Qatnashish
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 glass-card rounded-2xl p-3 md:p-4 shadow-medium animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">1-o'rin</div>
                    <div className="text-xs text-muted-foreground">Oltin medal</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 glass-card rounded-2xl p-3 md:p-4 shadow-medium animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">95 ball</div>
                    <div className="text-xs text-muted-foreground">Top natija!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
