import { Link } from 'react-router-dom';
import { ArrowRight, Search, Package, Truck, Home, Factory, ShieldCheck, MessageSquare, Plane, Ship, ClipboardCheck, Headphones, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import hero from '@/assets/hero-handshake.png';

const Index = () => {
  const { t, dir } = useLang();
  const Arrow = ArrowRight;

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 -start-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-10 end-10 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl" />
        </div>
        <div className="container-app py-10 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-5 sm:space-y-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium">
              {t.hero.badge}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gradient">{t.hero.title}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
              <Button variant="hero" size="xl" asChild className="w-full sm:w-auto">
                <Link to="/request">{t.hero.cta1} <Arrow className={`h-5 w-5 ${dir === 'rtl' ? 'rtl-flip' : ''}`} /></Link>
              </Button>
              <Button variant="outline" size="xl" asChild className="w-full sm:w-auto">
                <Link to="/how-it-works">{t.hero.cta2}</Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-border/50">
              {[['10K+', t.hero.stat1], ['2K+', t.hero.stat2], ['500+', t.hero.stat3]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{n}</div>
                  <div className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground leading-tight">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-fade-in-up order-first lg:order-last" style={{ animationDelay: '120ms' }}>
            <div className="absolute inset-0 bg-gradient-hero rounded-[1.5rem] sm:rounded-[2rem] blur-2xl opacity-30" />
            <img src={hero} alt="SOUQI bridges Morocco and China" className="relative rounded-[1.5rem] sm:rounded-[2rem] shadow-pop w-full" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-app py-12 sm:py-16 lg:py-20">
        <SectionHeader title={t.how.title} subtitle={t.how.subtitle} />
        <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Search, ...t.how.s1 },
            { icon: Package, ...t.how.s2 },
            { icon: Truck, ...t.how.s3 },
            { icon: Home, ...t.how.s4 },
          ].map((s, i) => (
            <div key={i} className="relative group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:shadow-pop hover:-translate-y-1 transition-smooth">
              <div className="absolute -top-3 -start-3 h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">{i + 1}</div>
              <div className="h-12 w-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gradient-soft py-12 sm:py-16 lg:py-20">
        <div className="container-app">
          <SectionHeader title={t.services.title} subtitle={t.services.subtitle} />
          <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Search, ...t.services.s1 },
              { icon: Plane, ...t.services.s2 },
              { icon: Ship, ...t.services.s3 },
              { icon: ClipboardCheck, ...t.services.s4 },
              { icon: ShieldCheck, ...t.services.s5 },
              { icon: Headphones, ...t.services.s6 },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-elegant transition-smooth">
                <div className="h-12 w-12 rounded-xl bg-gradient-hero text-white flex items-center justify-center mb-4 shadow-md">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-app py-12 sm:py-16 lg:py-20">
        <SectionHeader title={t.why.title} subtitle={t.why.subtitle} />
        <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Factory, ...t.why.r1 },
            { icon: ShieldCheck, ...t.why.r2 },
            { icon: CheckCircle2, ...t.why.r3 },
            { icon: MessageSquare, ...t.why.r4 },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border/50 hover:bg-gradient-card transition-smooth">
              <s.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gradient-soft py-12 sm:py-16 lg:py-20">
        <div className="container-app">
          <SectionHeader title={t.testimonials.title} subtitle={t.testimonials.subtitle} />
          <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: 'Youssef B.', city: 'Casablanca', text: 'استوردت أول دفعة إلكترونيات بأسعار أقل من السوق المحلي بـ 40٪. تجربة ممتازة!' },
              { name: 'Salma L.', city: 'Rabat', text: 'خدمة الدروبشيبينغ غيرت متجري بالكامل. شحن سريع وجودة ممتازة.' },
              { name: 'Karim H.', city: 'Marrakech', text: 'فريق محترف، أسعار شفافة، ودعم باللغة العربية. أنصح به بشدة.' },
            ].map((r, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <div className="h-10 w-10 rounded-full bg-gradient-hero text-white flex items-center justify-center font-semibold">{r.name[0]}</div>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-12 sm:py-16 lg:py-20">
        <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-hero p-6 sm:p-10 lg:p-16 text-center shadow-pop">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 start-1/4 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute bottom-0 end-1/4 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">{t.cta.title}</h2>
            <p className="text-white/85 max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg">{t.cta.subtitle}</p>
            <Button size="xl" variant="secondary" asChild className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
              <Link to="/request">{t.cta.button} <Arrow className={`h-5 w-5 ${dir === 'rtl' ? 'rtl-flip' : ''}`} /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center max-w-2xl mx-auto px-2">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">{title}</h2>
    <p className="text-muted-foreground text-base sm:text-lg">{subtitle}</p>
  </div>
);

export default Index;
