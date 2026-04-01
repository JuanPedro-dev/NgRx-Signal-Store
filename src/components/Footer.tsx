import { Zap, Heart } from "lucide-react";

export default function Footer() {
  const linkToCafe = () => {
    window.open('https://cafecito.app/juanpedro428', '_blank');
  };

  return (
    <footer className="py-12 px-4 border-t border-surface-800/50">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">
            NgRx SignalStore Factory
          </span>
        </div>

        <p className="text-surface-500 text-sm mb-4">
          Angular 21 · Signals · NgRx SignalStore · PrimeNG v21 · Tailwind v4
        </p>

        <p className="text-surface-600 text-xs flex items-center justify-center gap-1">
          Hecho con <Heart size={12} className="text-rose-400" /> por{" "}
          <span
            onClick={linkToCafe}
            className="font-bold cursor-pointer hover:underline"
          >
            Juan Pedro Trionfini
          </span>
        </p>
      </div>
    </footer>
  );
}
