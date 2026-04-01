import { useState, useEffect } from 'react';
import {
  Layers,
  Code2,
  FolderTree,
  BookOpen,
  Wrench,
  Sparkles,
  Menu,
  X,
  Zap,
} from 'lucide-react';

const navItems = [
  { id: 'hero', label: 'Inicio', icon: Zap },
  { id: 'architecture', label: 'Arquitectura', icon: Layers },
  { id: 'structure', label: 'Estructura', icon: FolderTree },
  { id: 'library', label: 'Librería', icon: Code2 },
  { id: 'examples', label: 'Ejemplos', icon: BookOpen },
  { id: 'generator', label: 'Generador', icon: Wrench },
  { id: 'practices', label: 'Prácticas', icon: Sparkles },
];

export default function Navigation() {
  const [active, setActive] = useState('hero');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navItems.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActive(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-surface-700/50 shadow-2xl shadow-surface-950/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <Zap size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-sm">NgRx SignalStore</span>
              <span className="text-primary-400 text-xs block -mt-0.5">Factory v21</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active === item.id
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden pb-4 animate-fadeIn">
            <div className="bg-surface-800/90 rounded-xl border border-surface-700/50 p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active === item.id
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
