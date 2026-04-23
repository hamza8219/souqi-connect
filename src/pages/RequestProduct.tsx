import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';

const schema = z.object({
  product_name: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  quantity: z.number().int().positive().max(1_000_000),
  budget: z.number().nonnegative().max(10_000_000).optional(),
  shipping_method: z.enum(['air', 'sea', 'dropshipping']),
  contact_whatsapp: z.string().trim().max(40).optional(),
  contact_email: z.string().trim().email().max(255).optional(),
  image_urls: z.string().trim().max(2000).optional(),
});

const RequestProduct = () => {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    product_name: '', description: '', quantity: '1', budget: '',
    shipping_method: 'sea' as 'air' | 'sea' | 'dropshipping',
    contact_whatsapp: '', contact_email: '', image_urls: '',
  });

  const upd = (k: string, v: string) => setForm(s => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parsed = schema.parse({
        product_name: form.product_name,
        description: form.description || undefined,
        quantity: parseInt(form.quantity || '1', 10),
        budget: form.budget ? parseFloat(form.budget) : undefined,
        shipping_method: form.shipping_method,
        contact_whatsapp: form.contact_whatsapp || undefined,
        contact_email: form.contact_email || undefined,
        image_urls: form.image_urls || undefined,
      });
      const { data: { session } } = await supabase.auth.getSession();
      const image_urls = parsed.image_urls
        ? parsed.image_urls.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
        : [];
      const { error } = await supabase.from('product_requests').insert({
        user_id: session?.user.id ?? null,
        product_name: parsed.product_name,
        description: parsed.description ?? null,
        quantity: parsed.quantity,
        budget: parsed.budget ?? null,
        shipping_method: parsed.shipping_method,
        contact_whatsapp: parsed.contact_whatsapp ?? null,
        contact_email: parsed.contact_email ?? null,
        image_urls,
      });
      if (error) throw error;
      toast.success(t.request.success);
      setDone(true);
    } catch (err: any) {
      toast.error(err?.message ?? t.request.error);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Layout>
        <div className="container-app py-24 max-w-xl text-center">
          <div className="h-20 w-20 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold mb-3">{t.request.success}</h1>
          <p className="text-muted-foreground mb-8">{t.request.subtitle}</p>
          <Button variant="hero" size="lg" onClick={() => { setDone(false); setForm({ product_name: '', description: '', quantity: '1', budget: '', shipping_method: 'sea', contact_whatsapp: '', contact_email: '', image_urls: '' }); }}>
            {t.dashboard.newRequest}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-app py-12 lg:py-20 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">{t.request.title}</h1>
          <p className="text-muted-foreground">{t.request.subtitle}</p>
        </div>
        <form onSubmit={submit} className="bg-card border border-border/50 rounded-2xl p-6 lg:p-8 shadow-elegant space-y-5">
          <Field label={t.request.productName + ' *'}>
            <Input required maxLength={200} value={form.product_name} onChange={e => upd('product_name', e.target.value)} placeholder="iPhone 15 case, LED light..." />
          </Field>
          <Field label={t.request.description}>
            <Textarea rows={4} maxLength={2000} value={form.description} onChange={e => upd('description', e.target.value)} placeholder={t.request.descPh} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label={t.request.quantity + ' *'}>
              <Input type="number" min={1} required value={form.quantity} onChange={e => upd('quantity', e.target.value)} />
            </Field>
            <Field label={t.request.budget}>
              <Input type="number" min={0} value={form.budget} onChange={e => upd('budget', e.target.value)} placeholder="MAD" />
            </Field>
          </div>
          <Field label={t.request.shippingMethod + ' *'}>
            <div className="grid grid-cols-3 gap-2">
              {([['air', t.request.air], ['sea', t.request.sea], ['dropshipping', t.request.dropshipping]] as const).map(([v, l]) => (
                <button type="button" key={v} onClick={() => upd('shipping_method', v)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-base ${form.shipping_method === v ? 'border-primary bg-primary-soft text-primary' : 'border-border hover:border-primary/40'}`}>
                  {l}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label={t.request.whatsapp}>
              <Input maxLength={40} value={form.contact_whatsapp} onChange={e => upd('contact_whatsapp', e.target.value)} placeholder="+212 ..." />
            </Field>
            <Field label={t.request.email}>
              <Input type="email" maxLength={255} value={form.contact_email} onChange={e => upd('contact_email', e.target.value)} placeholder="you@email.com" />
            </Field>
          </div>
          <Field label={t.request.images}>
            <Textarea rows={2} maxLength={2000} value={form.image_urls} onChange={e => upd('image_urls', e.target.value)} placeholder="https://..., https://..." />
          </Field>
          <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
            {loading ? t.request.submitting : t.request.submit}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    {children}
  </div>
);

export default RequestProduct;
