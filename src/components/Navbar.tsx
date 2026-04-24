import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import logo from '@/assets/souqi-logo.png';

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async (uid: string | undefined) => {
      if (!uid) { setIsAdmin(false); return; }
      const { data } = await supabase.rpc('has_role', { _user_id: uid, _role: 'admin' });
      setIsAdmin(!!data);
    };
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      checkAdmin(data.session?.user?.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      checkAdmin(session?.user?.id);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/services', label: t.nav.services },
    { to: '/how-it-works', label: t.nav.howItWorks },
    { to: '/pricing', label: t.nav.pricing },
    { to: '/dropshipping', label: t.nav.dropshipping },
    { to: '/contact', label: t.nav.contact },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-base ${scrolled ? 'bg-background/85 backdrop-blur-lg shadow-sm' : 'bg-background/60 backdrop-blur-sm'} border-b border-border/40`}>
      <div className="container-app flex h-16 lg:h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="SOUQI" className="h-10 lg:h-12 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-base hover:text-primary ${isActive ? 'text-primary' : 'text-foreground/75'}`
              }>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="gap-2">
            <Globe className="h-4 w-4" />
            {lang === 'ar' ? 'EN' : 'عربي'}
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild><Link to="/dashboard">{t.nav.dashboard}</Link></Button>
              {isAdmin && (
                <Button variant="ghost" size="sm" asChild><Link to="/admin">Admin</Link></Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>{t.nav.logout}</Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild><Link to="/auth">{t.nav.login}</Link></Button>
          )}
          <Button variant="hero" size="sm" asChild><Link to="/request">{t.nav.requestProduct}</Link></Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-muted transition-base" aria-label="menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
          <div className="container-app py-4 flex flex-col gap-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
                className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-medium ${isActive ? 'bg-primary-soft text-primary' : 'text-foreground/80 hover:bg-muted'}`}>
                {l.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-3 border-t border-border/50 mt-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
                <Globe className="h-4 w-4 me-2" />{lang === 'ar' ? 'English' : 'العربية'}
              </Button>
              {user ? (
                <Button variant="hero" size="sm" className="flex-1" asChild><Link to="/dashboard" onClick={() => setOpen(false)}>{t.nav.dashboard}</Link></Button>
              ) : (
                <Button variant="hero" size="sm" className="flex-1" asChild><Link to="/auth" onClick={() => setOpen(false)}>{t.nav.login}</Link></Button>
              )}
            </div>
            <Button variant="hero" size="lg" className="mt-2" asChild><Link to="/request" onClick={() => setOpen(false)}>{t.nav.requestProduct}</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}
