import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
  full_name: z.string().trim().max(100).optional(),
});

const Auth = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', full_name: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parsed = schema.parse({ ...form, full_name: mode === 'signup' ? form.full_name : undefined });
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: parsed.full_name ?? '' },
          },
        });
        if (error) throw error;
        toast.success('Check your email to confirm.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: parsed.email, password: parsed.password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Error');
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="container-app py-16 max-w-md">
        <div className="bg-card border rounded-2xl p-8 shadow-elegant">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {mode === 'login' ? t.auth.loginTitle : t.auth.signupTitle}
          </h1>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label>{t.auth.fullName}</Label>
                <Input maxLength={100} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
              </div>
            )}
            <div className="space-y-2">
              <Label>{t.auth.email}</Label>
              <Input type="email" required maxLength={255} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.password}</Label>
              <Input type="password" required minLength={6} maxLength={100} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {mode === 'login' ? t.auth.login : t.auth.signup}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-6">
            {mode === 'login' ? t.auth.noAccount : t.auth.haveAccount}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-primary font-medium hover:underline">
              {mode === 'login' ? t.auth.signup : t.auth.login}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
