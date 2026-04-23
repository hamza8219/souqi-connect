import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Plane, Ship, Search, ClipboardCheck, ShieldCheck, Headphones } from 'lucide-react';

const Services = () => {
  const { t } = useLang();
  const items = [
    { icon: Search, ...t.services.s1 },
    { icon: Plane, ...t.services.s2 },
    { icon: Ship, ...t.services.s3 },
    { icon: ClipboardCheck, ...t.services.s4 },
    { icon: ShieldCheck, ...t.services.s5 },
    { icon: Headphones, ...t.services.s6 },
  ];
  return (
    <Layout>
      <div className="container-app py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-3">{t.services.title}</h1>
          <p className="text-muted-foreground text-lg">{t.services.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border hover:shadow-pop hover:-translate-y-1 transition-smooth">
              <div className="h-14 w-14 rounded-2xl bg-gradient-hero text-white flex items-center justify-center mb-4 shadow-md">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.t}</h3>
              <p className="text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default Services;
