import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'fitshirt_consent_v1';

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) setVisible(true);
    } catch {
      // localStorage blocked — show banner once per session
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, new Date().toISOString()); } catch { /* ignore */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 sm:pb-6 pointer-events-none">
      <div className="max-w-3xl mx-auto bg-primary text-cream rounded-2xl shadow-2xl p-5 sm:p-6 pointer-events-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="text-sm leading-relaxed">
            FitShirt nutzt nur <strong>technisch notwendige</strong> Speicherung
            (z. B. Session-Login fuer das Admin-Dashboard). Es laufen keine
            Tracker, keine Analyse-Cookies, keine Werbung.{' '}
            <Link to="/datenschutz" className="underline hover:no-underline">
              Mehr in der Datenschutzerklaerung
            </Link>.
          </div>
          <button
            onClick={dismiss}
            className="bg-cream text-primary px-5 py-2 rounded-md font-medium hover:bg-accent transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
