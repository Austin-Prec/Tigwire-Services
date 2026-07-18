import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, Users, Globe } from 'lucide-react';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className="relative text-navy-100 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top right, #101F38 0%, #0B1626 45%, #060D17 100%)',
      }}
    >
      <div
        className="absolute -top-40 -right-24 w-[500px] h-[500px] rounded-full blur-[90px] opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(181,117,74,0.35), transparent 70%)' }}
        aria-hidden="true"
      />

      <div
        className={`relative container-main section-padding pb-8 transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >

        {/* Trust Badges Section — reflects Tigwire's stated commitments and
            targets from the business plan, not a fabricated track record.
            Update the "Malawian-Owned" and "Eco-Friendly" badges only if
            they stop being accurate; the other two are Year One targets,
            not achieved results, and are labelled that way deliberately. */}
        <div className="border-b border-navy-600 pb-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 text-center transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1">
              <MapPin size={28} className="text-clay-200 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.2} />
              <p className="font-arial text-navy-200 text-xs uppercase tracking-wider">Malawian-Owned</p>
              <p className="font-arial text-white text-sm font-medium">Lilongwe Based</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 text-center transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1">
              <Globe size={28} className="text-clay-200 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.2} />
              <p className="font-arial text-navy-200 text-xs uppercase tracking-wider">Products</p>
              <p className="font-arial text-white text-sm font-medium">Eco-Friendly</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 text-center transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1">
              <Users size={28} className="text-clay-200 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.2} />
              <p className="font-arial text-navy-200 text-xs uppercase tracking-wider">Our Goal</p>
              <p className="font-arial text-white text-sm font-medium">90%+ Satisfaction</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-5 text-center transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1">
              <Shield size={28} className="text-clay-200 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.2} />
              <p className="font-arial text-navy-200 text-xs uppercase tracking-wider">Emergency</p>
              <p className="font-arial text-white text-sm font-medium">24/7 Available</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-garamond text-white text-xl font-semibold mb-4">
              Tigwire Services
            </h3>
            <p className="font-arial text-sm leading-relaxed text-navy-200 max-w-md">
              Professional cleaning services for homes, offices, schools,
              hotels, and banks across Malawi. Reliable, affordable, and
              environmentally responsible.
            </p>
          </div>

          <div>
            <h4 className="font-garamond text-white text-lg font-semibold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Services' },
                { to: '/how-we-work', label: 'How We Work' },
                { to: '/what-to-expect', label: 'What to Expect' },
                { to: '/about', label: 'About' },
                { to: '/insights', label: 'Insights' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 font-arial text-sm text-navy-200 transition-colors duration-200 hover:text-clay-200"
                  >
                    <span className="h-px w-0 bg-clay-200 transition-all duration-300 group-hover:w-2.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-garamond text-white text-lg font-semibold mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-clay-200 mt-0.5 shrink-0" />
                <a
                  href="mailto:rachealkamaseko7@gmail.com"
                  className="font-arial text-sm text-navy-200 hover:text-clay-200 transition-colors duration-200"
                >
                  rachealkamaseko7@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-clay-200 mt-0.5 shrink-0" />
                <a
                  href="tel:+265992477611"
                  className="font-arial text-sm text-navy-200 hover:text-clay-200 transition-colors duration-200"
                >
                  +265 992 477 611
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-clay-200 mt-0.5 shrink-0" />
                <span className="font-arial text-sm text-navy-200">
                  Area 18B, Lilongwe
                </span>
              </li>
            </ul>
            {/* Social links (Facebook, Instagram, TikTok, WhatsApp Business)
                are listed in the business plan as planned marketing
                channels, but no live handles were provided. Add a block
                here, mirroring the pattern above, once real profile URLs
                exist — a placeholder link would send visitors to a
                nonexistent or wrong page. */}
          </div>
        </div>

        <div className="border-t border-navy-600 pt-6">
          <p className="font-arial text-xs text-navy-300 text-center">
            &copy; 2026 Tigwire Services. All rights reserved.
          </p>
          {/* No registration/incorporation line here deliberately: the
              business plan's Year One objectives include registering the
              business and obtaining operational licenses, which implies
              this hasn't happened yet. Add a line here once real
              registration details exist, matching the format above. */}
        </div>
      </div>
    </footer>
  );
}
