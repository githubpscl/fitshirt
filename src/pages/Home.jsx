import { Link } from 'react-router-dom';
import { Ruler, Sparkles, Package, ArrowRight, Check } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-slide-up">
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs tracking-widest uppercase mb-6">
              Made-to-measure
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-primary leading-tight">
              Das T-Shirt, <br /> das wirklich passt.
            </h1>
            <p className="mt-6 text-lg text-primary-500 max-w-xl leading-relaxed">
              Schluss mit Kompromissen zwischen Schulter und Brustweite.
              Sag uns deine Masse und deinen Fit-Wunsch — wir liefern dir den
              Schnitt, der genau zu dir gehoert.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/konfigurator" className="btn-primary text-base">
                Jetzt Passform finden <ArrowRight size={18} />
              </Link>
              <a href="#wie-es-funktioniert" className="btn-ghost">
                So funktioniert es
              </a>
            </div>
            <p className="mt-8 text-sm text-primary-400 flex items-center gap-2">
              <Check size={16} className="text-primary" /> Ueber 80 verschiedene Schnittmuster
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-square bg-gradient-to-br from-accent-100 to-accent rounded-3xl flex items-center justify-center shadow-xl">
              <svg viewBox="0 0 240 280" className="w-2/3 h-2/3 text-primary">
                <path d="M80 40 L120 30 L160 40 L195 60 L205 95 L180 105 L180 240 L60 240 L60 105 L35 95 L45 60 Z"
                  fill="currentColor" fillOpacity="0.92" />
                <circle cx="120" cy="22" r="14" fill="currentColor" fillOpacity="0.85" />
              </svg>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-lg">
                <div className="text-2xl font-semibold text-primary">98%</div>
                <div className="text-xs text-primary-400">Passgenauigkeit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="wie-es-funktioniert" className="bg-white border-y border-primary-100">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary text-center">
            In drei Schritten zum perfekten Shirt
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 mt-14">
            {[
              { icon: Ruler, title: '1. Masse eingeben', text: 'Erfasse 10 Koerpermasse mit klaren Anleitungen — in unter 3 Minuten.' },
              { icon: Sparkles, title: '2. Passform finden', text: 'Unser Algorithmus matched dich auf einen von 80+ Schnitten.' },
              { icon: Package, title: '3. Bestellen', text: 'Wir fertigen dein Shirt in deiner Wunschfarbe in 10–14 Werktagen.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto bg-accent text-primary rounded-xl flex items-center justify-center mb-4">
                  <step.icon size={26} />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-primary-500 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="card p-10 sm:p-14 text-center">
          <h2 className="text-3xl font-semibold text-primary mb-4">Bereit fuer dein perfektes T-Shirt?</h2>
          <p className="text-primary-500 mb-8 max-w-xl mx-auto">
            65 € pro Shirt. Versandkostenfrei in Deutschland. 14 Tage Rueckgaberecht.
          </p>
          <Link to="/konfigurator" className="btn-primary text-base">
            Jetzt Passform finden <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
