import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '265992477611';
  const message = encodeURIComponent(
    'Hello, I would like to enquire about Tigwire Services cleaning services.'
  );
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe57] transition-colors duration-200"
    >
      <MessageCircle size={28} strokeWidth={2} />
    </a>
  );
}
