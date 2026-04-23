import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Package, Truck, Wrench, CheckCircle2 } from 'lucide-react';

const Pricing = () => {
  const { t } = useLang();
  const items = [
    { icon: Package, t: t.pricing.productCost, d: t.pricing.productCostD },
    { icon: Truck, t: t.pricing.shippingCost, d: t.pricing.shippingCostD },
    { icon: Wrench, t: t.pricing.serviceFee, d: t.pricing.serviceFeeD },
  ];
  return (
    <Layout>
      <div className="container-app py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-3">{t.pricing.title}</h1>
          <p className="text-muted-foreground text-lg">{t.pricing.subtitle}</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border hover:shadow-elegant transition-smooth">
              <div className="h-12 w-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mb-4">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.t}</h3>
              <p className="text-muted-foreground text-sm">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto mt-12 p-8 rounded-2xl bg-gradient-card border">
          <h3 className="font-semibold text-xl mb-4">{t.pricing.breakdown}</h3>
          <ul className="space-y-3">
            {[t.pricing.productCost, t.pricing.shippingCost, t.pricing.serviceFee].map(l => (
              <li key={l} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" /> {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};
export default Pricing;
