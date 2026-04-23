import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

type Req = {
  id: string;
  product_name: string;
  quantity: number;
  shipping_method: string;
  status: keyof ReturnType<typeof useLang>['t']['dashboard']['status'];
  total_cost: number | null;
  tracking_number: string | null;
  created_at: string;
};

const statusColor: Record<string, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-warning/15 text-warning',
  quoted: 'bg-primary-soft text-primary',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-success/15 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const Dashboard = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [reqs, setReqs] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      const { data } = await supabase
        .from('product_requests')
        .select('id, product_name, quantity, shipping_method, status, total_cost, tracking_number, created_at')
        .order('created_at', { ascending: false });
      if (mounted) { setReqs((data as any) ?? []); setLoading(false); }
    };
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate('/auth'); });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [navigate]);

  return (
    <Layout>
      <div className="container-app py-12">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">{t.dashboard.title}</h1>
          <Button variant="hero" asChild><Link to="/request"><Plus className="h-4 w-4" /> {t.dashboard.newRequest}</Link></Button>
        </div>

        {loading ? (
          <div className="grid gap-4">{[1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)}</div>
        ) : reqs.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-2xl">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t.dashboard.empty}</p>
            <Button variant="hero" asChild><Link to="/request">{t.dashboard.newRequest}</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {reqs.map(r => (
              <div key={r.id} className="p-5 rounded-2xl border bg-card hover:shadow-elegant transition-base">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-lg">{r.product_name}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      Qty: {r.quantity} · {r.shipping_method.toUpperCase()} · {new Date(r.created_at).toLocaleDateString()}
                    </div>
                    {r.tracking_number && (
                      <div className="text-xs text-muted-foreground mt-1">Tracking: <span className="font-mono">{r.tracking_number}</span></div>
                    )}
                  </div>
                  <div className="text-end">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor[r.status] ?? statusColor.pending}`}>
                      {t.dashboard.status[r.status as keyof typeof t.dashboard.status] ?? r.status}
                    </span>
                    {r.total_cost && <div className="mt-2 font-bold text-primary">{Number(r.total_cost).toLocaleString()} MAD</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
