import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

const Contact = () => {
  const { lang } = useLang();
  const isAr = lang === 'ar';
  return (
    <Layout>
      <div className="container-app py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">{isAr ? 'تواصل معنا' : 'Contact Us'}</h1>
          <p className="text-muted-foreground text-lg">{isAr ? 'فريقنا متاح لمساعدتك' : 'Our team is here to help'}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: MessageCircle, t: 'WhatsApp', d: '+212 600 000 000', href: 'https://wa.me/212600000000' },
            { icon: Mail, t: 'Email', d: 'hello@souqi.ma', href: 'mailto:hello@souqi.ma' },
            { icon: MapPin, t: isAr ? 'العنوان' : 'Address', d: 'Casablanca, Morocco' },
          ].map((s, i) => (
            <a key={i} href={s.href ?? '#'} className="p-6 rounded-2xl bg-card border text-center hover:shadow-elegant hover:-translate-y-1 transition-smooth">
              <s.icon className="h-10 w-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default Contact;
