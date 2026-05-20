import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Loader2 } from 'lucide-react';
import { api, COLORS } from '../lib/api.js';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.getOrder(id)
      .then((o) => { if (!cancelled) setOrder(o); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-primary mb-2">Bestellung nicht gefunden</h1>
        <p className="text-primary-400 mb-6">{error}</p>
        <Link to="/" className="btn-primary">Zur Startseite</Link>
      </div>
    );
  }

  const color = COLORS.find((c) => c.id === order.color);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-3xl font-semibold text-primary mb-2">Danke fuer deine Bestellung!</h1>
        <p className="text-primary-400">Wir haben deine Bestellung erhalten und beginnen mit der Fertigung.</p>
      </div>

      <div className="card p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-primary-100">
          <div>
            <div className="text-xs text-primary-400 uppercase tracking-wider">Bestellnummer</div>
            <div className="text-xl font-semibold text-primary">{order.id}</div>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary-50 text-primary text-sm capitalize">
            {order.status === 'neu' ? 'Eingegangen' : order.status}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 py-6">
          <Block label="Schnitt">{order.patternName} <span className="text-primary-400">({order.patternId})</span></Block>
          <Block label="Fit">{capitalize(order.fitGroup)}</Block>
          <Block label="Farbe">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full ring-1 ring-primary-200" style={{ backgroundColor: color?.hex || '#999' }} />
              {color?.label || order.color}
            </span>
          </Block>
          <Block label="Aermel / Kragen">{capitalize(order.sleeveType)} · {capitalize(order.neckType)}</Block>
        </div>

        <div className="pt-6 border-t border-primary-100">
          <div className="text-xs text-primary-400 uppercase tracking-wider mb-3">Shirt-Masse</div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {Object.entries(order.shirtMeasurements || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-primary-50 py-1 text-sm">
                <span className="text-primary-500">{labelFor(k)}</span>
                <span className="text-primary tabular-nums">{v} cm</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-accent-50 border border-accent-200 rounded-md flex items-start gap-3">
          <Package size={20} className="text-primary mt-0.5" />
          <div className="text-sm text-primary-600">
            <strong>Wird innerhalb von 10–14 Werktagen gefertigt.</strong>
            <br />
            Du erhaeltst eine E-Mail an <span className="text-primary">{order.customer.email}</span>, sobald deine Bestellung versendet wird.
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/" className="btn-ghost">Zur Startseite</Link>
      </div>
    </div>
  );
}

function Block({ label, children }) {
  return (
    <div>
      <div className="text-xs text-primary-400 uppercase tracking-wider">{label}</div>
      <div className="text-primary mt-1">{children}</div>
    </div>
  );
}
function capitalize(s) { if (!s) return ''; return s.charAt(0).toUpperCase() + s.slice(1); }
function labelFor(k) {
  const m = { chest: 'Brustweite', shoulder: 'Schulterbreite', upperArm: 'Aermelumfang', armLength: 'Aermellaenge', backLength: 'Rueckenlaenge', neckWidth: 'Kragenweite', waist: 'Taille' };
  return m[k] || k;
}
