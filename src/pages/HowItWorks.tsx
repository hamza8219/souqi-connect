import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Search, Package, Truck, Home } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLang();
  const steps = [
    { icon: Search, ...t.how.s1 },
    { icon: Package, ...t.how.s2 },
    { icon: Truck, ...t.how.s3 },
    { icon: Home, ...t.how.s4 },
  ];
  return (
    <Layout>
      <div className="container-app py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-3">{t.how.title}</h1>
          <p className="text-muted-foreground text-lg">{t.how.subtitle}</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-5 p-6 rounded-2xl bg-gradient-card border">
              <div className="shrink-0 h-14 w-14 rounded-2xl bg-gradient-hero text-white flex items-center justify-center font-bold text-xl shadow-md">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  <s.icon className="h-5 w-5 text-primary" /> {s.t}
                </h3>
                <p className="text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default HowItWorks;
