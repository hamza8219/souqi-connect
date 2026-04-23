import Layout from '@/components/Layout';
import { useLang } from '@/i18n/LanguageContext';
import { Mail, MessageCircle, MapPin, Instagram } from 'lucide-react';
import { WeChatIcon } from '@/components/icons/WeChatIcon';
import { socials } from '@/config/socials';

const Contact = () => {
  const { lang } = useLang();
  const isAr = lang === 'ar';

  const channels = [
    { icon: MessageCircle, t: 'WhatsApp', d: '+' + socials.whatsapp.phone, href: socials.whatsapp.url, color: 'text-[#25D366]' },
    { icon: WeChatIcon, t: 'WeChat', d: isAr ? `معرّف: ${socials.wechat.id}` : `ID: ${socials.wechat.id}`, href: socials.wechat.url, color: 'text-[#07C160]' },
    { icon: Instagram, t: 'Instagram', d: socials.instagram.handle, href: socials.instagram.url, color: 'text-[#E4405F]' },
    { icon: Mail, t: 'Email', d: socials.email, href: `mailto:${socials.email}`, color: 'text-primary' },
    { icon: MapPin, t: isAr ? 'العنوان' : 'Address', d: 'Casablanca, Morocco', href: '#', color: 'text-primary' },
  ];

  return (
    <Layout>
      <div className="container-app py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">{isAr ? 'تواصل معنا' : 'Contact Us'}</h1>
          <p className="text-muted-foreground text-lg">{isAr ? 'فريقنا متاح لمساعدتك على القناة التي تفضلها' : 'Reach out on the channel that suits you best'}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {channels.map((s, i) => {
            const Icon = s.icon as any;
            return (
              <a
                key={i}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group p-6 rounded-2xl bg-card border hover:border-primary/40 hover:shadow-pop hover:-translate-y-1 transition-smooth flex items-start gap-4"
              >
                <div className={`h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center shrink-0 ${s.color} group-hover:scale-110 transition-base`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.t}</h3>
                  <p className="text-sm text-muted-foreground break-all">{s.d}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
export default Contact;
