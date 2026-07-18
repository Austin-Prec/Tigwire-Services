import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/how-we-work', label: 'How We Work' },
    { to: '/what-to-expect', label: 'What to Expect' },
    { to: '/about', label: 'About' },
    { to: '/insights', label: 'Insights' },
    { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 24);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close the mobile menu on any route change, so navigating from the
    // open mobile menu doesn't leave it stuck open behind the new page.
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-navy-500/85 backdrop-blur-md shadow-[0_4px_24px_rgba(7,12,19,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'bg-navy-500/60 backdrop-blur-sm'
            }`}
        >
            <div className="container-fluid px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src="/tigwire-logo.png"
                            alt="Tigwire Services"
                            className="h-10 w-auto object-contain"
                        />
                        <span className="font-garamond font-semibold text-white text-lg">Tigwire Services</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative font-arial text-sm px-3 py-2 rounded-lg transition-colors duration-200 ${
                                        isActive
                                            ? 'text-clay-200'
                                            : 'text-white/80 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-clay-200" />
                                    )}
                                </Link>
                            );
                        })}
                        <Link
                            to="/contact"
                            className="ml-3 rounded-lg bg-gradient-to-br from-clay-100 to-clay-200 px-5 py-2.5 font-arial text-sm font-semibold text-navy-600 shadow-[0_4px_16px_rgba(181,117,74,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(181,117,74,0.45),inset_0_1px_0_rgba(255,255,255,0.4)]"
                        >
                            Get a Free Quote
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-white"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {mobileOpen && (
                    <div className="md:hidden mt-4 flex flex-col gap-1 pb-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`font-arial text-sm px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                                        isActive ? 'text-clay-200 bg-white/5' : 'text-white/80 hover:bg-white/5'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <Link
                            to="/contact"
                            onClick={() => setMobileOpen(false)}
                            className="mt-2 rounded-lg bg-gradient-to-br from-clay-100 to-clay-200 px-4 py-3 text-center font-arial text-sm font-semibold text-navy-600 shadow-[0_4px_16px_rgba(181,117,74,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]"
                        >
                            Get a Free Quote
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
