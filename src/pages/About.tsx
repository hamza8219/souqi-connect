import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Target, Heart, Globe } from 'lucide-react';

const About = () => {
  const { lang } = useLang();
  const isAr = lang === 'ar';
  return (
    <Layout>
      <div className="container-app py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{isAr ? 'من نحن' : 'About SOUQI'}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {isAr
              ? 'سوقي منصة مغربية تربط التجار والمستهلكين مباشرة بالمصانع والموردين في الصين، بأسعار شفافة وخدمة موثوقة من الباب إلى الباب.'
              : 'SOUQI is a Moroccan platform connecting merchants and consumers directly with factories and suppliers in China — with transparent pricing and reliable door-to-door service.'}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, t: isAr ? 'مهمتنا' : 'Mission', d: isAr ? 'تسهيل الاستيراد لكل مغربي' : 'Make importing easy for every Moroccan' },
            { icon: Heart, t: isAr ? 'قيمنا' : 'Values', d: isAr ? 'الثقة، الشفافية، والخدمة' : 'Trust, transparency, and service' },
            { icon: Globe, t: isAr ? 'رؤيتنا' : 'Vision', d: isAr ? 'أن نكون الجسر الأول بين المغرب والصين' : 'Be the leading bridge between Morocco and China' },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-gradient-card border text-center">
              <s.icon className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default About;
