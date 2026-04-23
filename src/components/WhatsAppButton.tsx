import { MessageCircle } from 'lucide-react';
import { socials } from '@/config/socials';

export default function WhatsAppButton() {
  return (
    <a
      href={socials.whatsapp.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 end-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-pop flex items-center justify-center hover:scale-110 transition-smooth animate-float"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
