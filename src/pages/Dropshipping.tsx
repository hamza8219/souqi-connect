import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Store, PackageCheck, Globe, Zap } from 'lucide-react';

const Dropshipping = () => {
  const { t } = useLang();
  const features = [
    { icon: Store, title: 'Zero Inventory', desc: 'Sell without holding any stock' },
    { icon: PackageCheck, title: 'Direct Shipping', desc: 'We ship directly to your customers' },
    { icon: Globe, title: 'Global Suppliers', desc: 'Access thousands of products from China' },
    { icon: Zap, title: 'Fast Fulfillment', desc: 'Quick processing and shipping times' },
  ];
  return (
    <Layout>
      <section className="bg-gradient-soft py-16">
        <div className="container-app text-center max-w-3xl mx-auto">
          <span className="inline-block bg-primary-soft text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">Dropshipping</span>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{t.nav.dropshipping}</h1>
          <p className="text-muted-foreground text-lg mb-8">Run your e-commerce store in Morocco without inventory. We source, store, and ship to your customers — you focus on selling.</p>
          <Button variant="hero" size="xl" asChild><Link to="/request">{t.nav.requestProduct}</Link></Button>
        </div>
      </section>
      <section className="container-app py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border hover:shadow-elegant transition-smooth">
              <f.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};
export default Dropshipping;
