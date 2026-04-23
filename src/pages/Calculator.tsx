import { useState } from 'react';
import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator as CalcIcon } from 'lucide-react';

const Calculator = () => {
  const { t } = useLang();
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [method, setMethod] = useState<'air' | 'sea' | 'dropshipping'>('sea');
  const [result, setResult] = useState<number | null>(null);

  const calc = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price) || 0;
    const w = parseFloat(weight) || 0;
    const ratePerKg = method === 'air' ? 80 : method === 'sea' ? 25 : 100;
    const shipping = w * ratePerKg;
    const fee = (p + shipping) * 0.08;
    setResult(p + shipping + fee);
  };

  return (
    <Layout>
      <div className="container-app py-16 max-w-2xl">
        <div className="text-center mb-10">
          <div className="h-16 w-16 rounded-2xl bg-gradient-hero text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <CalcIcon className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold mb-3">{t.calc.title}</h1>
          <p className="text-muted-foreground text-lg">{t.calc.subtitle}</p>
        </div>
        <form onSubmit={calc} className="bg-card border rounded-2xl p-6 lg:p-8 shadow-elegant space-y-5">
          <div className="space-y-2">
            <Label>{t.calc.productPrice}</Label>
            <Input type="number" min={0} step="0.01" required value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.calc.weight}</Label>
            <Input type="number" min={0} step="0.1" required value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t.calc.method}</Label>
            <div className="grid grid-cols-3 gap-2">
              {([['air', t.request.air], ['sea', t.request.sea], ['dropshipping', t.request.dropshipping]] as const).map(([v, l]) => (
                <button type="button" key={v} onClick={() => setMethod(v)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-base ${method === v ? 'border-primary bg-primary-soft text-primary' : 'border-border hover:border-primary/40'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Button variant="hero" size="lg" className="w-full">{t.calc.calculate}</Button>
        </form>
        {result !== null && (
          <div className="mt-6 p-8 rounded-2xl bg-gradient-hero text-white text-center shadow-pop animate-fade-in-up">
            <div className="text-sm opacity-80 mb-2">{t.calc.result}</div>
            <div className="text-4xl font-bold">{result.toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD</div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Calculator;
