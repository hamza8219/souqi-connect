import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = '212600000000'; // placeholder
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 end-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-pop flex items-center justify-center hover:scale-110 transition-smooth animate-float"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
