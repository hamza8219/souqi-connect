import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';

const Tracking = () => {
  const { t } = useLang();
  const [num, setNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setNotFound(false); setResult(null);
    const { data } = await supabase
      .from('product_requests')
      .select('product_name, status, shipping_method, tracking_number, created_at')
      .eq('tracking_number', num.trim())
      .maybeSingle();
    if (!data) setNotFound(true); else setResult(data);
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container-app py-16 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">{t.track.title}</h1>
          <p className="text-muted-foreground text-lg">{t.track.subtitle}</p>
        </div>
        <form onSubmit={track} className="flex gap-2">
          <Input value={num} onChange={e => setNum(e.target.value)} placeholder={t.track.placeholder} required maxLength={100} />
          <Button variant="hero" disabled={loading}><Search className="h-4 w-4" /> {t.track.track}</Button>
        </form>
        {notFound && <div className="mt-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm text-center">{t.track.notFound}</div>}
        {result && (
          <div className="mt-6 p-6 rounded-2xl bg-card border shadow-elegant">
            <h3 className="font-semibold text-lg">{result.product_name}</h3>
            <div className="mt-2 text-sm text-muted-foreground">{result.shipping_method?.toUpperCase()}</div>
            <div className="mt-4 inline-block px-3 py-1 rounded-full text-sm bg-primary-soft text-primary font-semibold">
              {t.dashboard.status[result.status as keyof typeof t.dashboard.status] ?? result.status}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Tracking;
