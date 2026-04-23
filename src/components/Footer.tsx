import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { WeChatIcon } from '@/components/icons/WeChatIcon';
import { socials } from '@/config/socials';
import logo from '@/assets/souqi-logo.png';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border/50 bg-gradient-soft mt-20">
      <div className="container-app py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="SOUQI" className="h-14 w-auto mb-3" />
          <p className="text-muted-foreground max-w-sm text-sm mb-4">{t.footer.tagline}</p>
          <div className="flex gap-2">
            <a href={socials.whatsapp.url} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
              className="h-10 w-10 rounded-xl bg-card border flex items-center justify-center hover:border-primary hover:text-primary transition-base">
              <MessageCircle className="h-5 w-5" />
            </a>
            <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="h-10 w-10 rounded-xl bg-card border flex items-center justify-center hover:border-primary hover:text-primary transition-base">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={socials.wechat.url} target="_blank" rel="noopener noreferrer" aria-label="WeChat"
              className="h-10 w-10 rounded-xl bg-card border flex items-center justify-center hover:border-primary hover:text-primary transition-base">
              <WeChatIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">{t.footer.product}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-primary">{t.nav.services}</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">{t.nav.pricing}</Link></li>
            <li><Link to="/calculator" className="hover:text-primary">{t.nav.calculator}</Link></li>
            <li><Link to="/tracking" className="hover:text-primary">{t.nav.tracking}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">{t.footer.company}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">{t.nav.about}</Link></li>
            <li><Link to="/contact" className="hover:text-primary">{t.nav.contact}</Link></li>
            <li><Link to="/faq" className="hover:text-primary">{t.nav.faq}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="container-app py-5 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} SOUQI · {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
