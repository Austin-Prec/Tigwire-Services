import { Mail, Phone, MapPin, Linkedin, Clock } from 'lucide-react';

const ICONS: Record<string, typeof Mail> = { Mail, Phone, MapPin, Linkedin };

interface ContactChannel {
  icon: string;
  label: string;
  value: string;
  link?: string;
  sub?: string;
}

interface ContactSidebarBlockProps {
  content: {
    heading?: string;
    channels?: ContactChannel[];
    response_time?: string;
  };
}

export default function ContactSidebarBlock({ content }: ContactSidebarBlockProps) {
  return (
    <div className="lg:col-span-2">
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8 sticky top-28 transition-shadow duration-300 hover:shadow-[0_20px_50px_-20px_rgba(21,42,74,0.2)]">
        {content.heading && (
          <h3 className="font-garamond text-navy-500 text-xl font-semibold mb-6">
            {content.heading}
          </h3>
        )}

        <div className="space-y-6">
          {content.channels?.map((channel, i) => {
            const IconComponent = ICONS[channel.icon] || Mail;
            const valueContent = channel.link ? (
              <a
                href={channel.link}
                target={channel.link.startsWith('http') ? '_blank' : undefined}
                rel={channel.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="font-arial text-gray-700 text-sm hover:text-sage-400 transition-colors"
              >
                {channel.value}
              </a>
            ) : (
              <p className="font-arial text-gray-700 text-sm">{channel.value}</p>
            );

            return (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-sage-100 p-2 rounded-lg">
                  <IconComponent size={18} className="text-sage-400" />
                </div>
                <div>
                  <p className="font-arial text-navy-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    {channel.label}
                  </p>
                  {valueContent}
                  {channel.sub && (
                    <p className="font-arial text-gray-400 text-xs mt-1">{channel.sub}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {content.response_time && (
          <>
            <div className="border-t border-gray-200 my-6" />
            <div className="flex items-start gap-4">
              <div className="bg-navy-100 p-2 rounded-lg">
                <Clock size={18} className="text-navy-500" />
              </div>
              <div>
                <p className="font-arial text-navy-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  Response Time
                </p>
                <p className="font-arial text-gray-600 text-sm">{content.response_time}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
