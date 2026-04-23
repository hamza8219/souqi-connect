import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const { lang } = useLang();
  const ar = [
    { q: 'كم تستغرق عملية الاستيراد؟', a: 'الشحن البحري 25-40 يوماً، الجوي 5-10 أيام.' },
    { q: 'هل أحتاج لرخصة استيراد؟', a: 'للكميات الصغيرة لا تحتاج، نتولى نحن كل الإجراءات.' },
    { q: 'كيف يتم الدفع؟', a: 'تحويل بنكي، بطاقة ائتمان، أو دفع نقدي عند الاستلام للطلبات الصغيرة.' },
    { q: 'ماذا لو وصل المنتج تالفاً؟', a: 'نقوم بالتحقق من الجودة قبل الشحن ونتحمل المسؤولية في حال أي تلف.' },
    { q: 'هل تشحنون لكل مدن المغرب؟', a: 'نعم، نشحن لكافة المدن المغربية.' },
  ];
  const en = [
    { q: 'How long does the import process take?', a: 'Sea freight 25-40 days, air freight 5-10 days.' },
    { q: 'Do I need an import license?', a: 'Not for small quantities — we handle everything.' },
    { q: 'How do I pay?', a: 'Bank transfer, credit card, or cash on delivery for smaller orders.' },
    { q: 'What if the product arrives damaged?', a: 'We inspect quality before shipping and take responsibility for any damage.' },
    { q: 'Do you ship to all Moroccan cities?', a: 'Yes, we ship across all of Morocco.' },
  ];
  const items = lang === 'ar' ? ar : en;
  return (
    <Layout>
      <div className="container-app py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">{lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h1>
        <Accordion type="single" collapsible className="space-y-3">
          {items.map((it, i) => (
            <AccordionItem key={i} value={String(i)} className="border rounded-2xl px-5 bg-card">
              <AccordionTrigger className="text-start hover:no-underline font-semibold">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
};
export default FAQ;
