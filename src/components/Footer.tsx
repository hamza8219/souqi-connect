import { Link } from 'react-router-dom';
import { useLang } from '@/i18n/LanguageContext';
import logo from '@/assets/souqi-logo.png';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border/50 bg-gradient-soft mt-20">
      <div className="container-app py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="SOUQI" className="h-14 w-auto mb-3" />
          <p className="text-muted-foreground max-w-sm text-sm">{t.footer.tagline}</p>
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
