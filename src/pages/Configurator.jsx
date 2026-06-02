import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2, CircleAlert } from 'lucide-react';
import WizardSteps from '../components/WizardSteps.jsx';
import MeasurementInput from '../components/MeasurementInput.jsx';
import FitSilhouette from '../components/FitSilhouette.jsx';
import { api, COLORS } from '../lib/api.js';

const DRAFT_KEY = 'fitshirt_configurator_draft_v1';

const MEASUREMENT_FIELDS = [
  { key: 'height',     label: 'Koerpergroesse',   min: 150, max: 210, hint: 'Stehend ohne Schuhe, vom Scheitel bis zum Boden.', warning: [155, 205] },
  { key: 'weight',     label: 'Koerpergewicht',   min: 40,  max: 180, unit: 'kg', hint: 'Aktuelles Gewicht in Kilogramm.', warning: [45, 160] },
  { key: 'chest',      label: 'Brustumfang',      min: 70,  max: 160, hint: 'Mass direkt unter den Achseln, um die volle Brust.', warning: [80, 140] },
  { key: 'shoulder',   label: 'Schulterbreite',   min: 30,  max: 60,  hint: 'Von Schultergelenk zu Schultergelenk, ueber den Ruecken.', warning: [38, 55] },
  { key: 'armLength',  label: 'Armlaenge',        min: 50,  max: 90,  hint: 'Vom Schultergelenk bis zum Handgelenk, Arm leicht gebeugt.', warning: [55, 80] },
  { key: 'upperArm',   label: 'Oberarmumfang',    min: 20,  max: 50,  hint: 'Umfang des entspannten Bizeps an der dicksten Stelle.', warning: [25, 45] },
  { key: 'waist',      label: 'Taillenumfang',    min: 60,  max: 140, hint: 'Schmalste Stelle des Rumpfes, meist oberhalb des Bauchnabels.', warning: [70, 130] },
  { key: 'hip',        label: 'Hueftumfang',      min: 70,  max: 150, hint: 'Breiteste Stelle der Huefte.', warning: [80, 130] },
  { key: 'backLength', label: 'Rueckenlaenge',    min: 35,  max: 60,  hint: 'Vom Halsansatz (7. Halswirbel) bis zum Hosenbund.', warning: [42, 55] },
  { key: 'neck',       label: 'Halsumfang',       min: 30,  max: 55,  hint: 'Umfang am Halsansatz fuer den Kragen.', warning: [33, 50] },
];

const FIT_OPTIONS = [
  { id: 'slim',      label: 'Slim Fit',      desc: 'Eng, koerperbetont' },
  { id: 'athletic',  label: 'Athletic Fit',  desc: 'Schultern betont, schmal zur Taille' },
  { id: 'regular',   label: 'Regular Fit',   desc: 'Klassisch, ausgewogen' },
  { id: 'relaxed',   label: 'Relaxed Fit',   desc: 'Locker, bequem' },
  { id: 'oversized', label: 'Oversized',     desc: 'Bewusst weit, Streetwear-Style' },
];

const SLEEVE_OPTIONS = [
  { id: 'kurzarm', label: 'Kurzarm' },
  { id: 'langarm', label: 'Langarm' },
];

const NECK_OPTIONS = [
  { id: 'rundhals', label: 'Rundhals' },
  { id: 'v-ausschnitt', label: 'V-Ausschnitt' },
];

const LENGTH_OPTIONS = [
  { id: 'kurz', label: 'Kurz (-3 cm)' },
  { id: 'normal', label: 'Normal' },
  { id: 'lang', label: 'Lang (+3 cm)' },
];

const PRICE_MATCH = 65;
const PRICE_MTM = 129;

function emptyMeasurements() {
  return Object.fromEntries(MEASUREMENT_FIELDS.map((f) => [f.key, '']));
}

// Read the saved draft once on mount. Stored in sessionStorage, so a tab
// reload doesn't lose progress, but closing the tab does (we don't want
// stale measurements lingering forever).
function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function Configurator() {
  const navigate = useNavigate();
  const draft = loadDraft();
  const [step, setStep] = useState(draft?.step || 1);
  const [measurements, setMeasurements] = useState(draft?.measurements || emptyMeasurements());
  const [fit, setFit] = useState(draft?.fit || 'athletic');
  const [sleeve, setSleeve] = useState(draft?.sleeve || 'kurzarm');
  const [neck, setNeck] = useState(draft?.neck || 'rundhals');
  const [lengthPref, setLengthPref] = useState(draft?.lengthPref || 'normal');
  const [color, setColor] = useState(draft?.color || 'navy');
  const [match, setMatch] = useState(null);
  const [tuning, setTuning] = useState({});
  const [productionType, setProductionType] = useState(draft?.productionType || 'match');
  // Customer data is intentionally NOT restored — that's PII and shouldn't
  // linger in storage across navigations.
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', address: '' });
  const [acceptedAgb, setAcceptedAgb] = useState(false);
  const [acceptedWiderruf, setAcceptedWiderruf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Persist non-PII wizard state across reloads.
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        step, measurements, fit, sleeve, neck, lengthPref, color, productionType,
      }));
    } catch { /* storage full or blocked — silently ignore */ }
  }, [step, measurements, fit, sleeve, neck, lengthPref, color, productionType]);

  const filled = useMemo(() => {
    return MEASUREMENT_FIELDS.every((f) => {
      const v = Number(measurements[f.key]);
      return Number.isFinite(v) && v >= f.min && v <= f.max;
    });
  }, [measurements]);

  const measurementsNumeric = useMemo(() => {
    const out = {};
    for (const f of MEASUREMENT_FIELDS) out[f.key] = Number(measurements[f.key]);
    return out;
  }, [measurements]);

  const activeShirtSpec = useMemo(() => {
    if (!match) return null;
    return productionType === 'mtm' && match.mtm ? match.mtm.shirtMeasurements : match.shirtMeasurements;
  }, [match, productionType]);

  const tunedShirtMeasurements = useMemo(() => {
    if (!activeShirtSpec) return null;
    const out = { ...activeShirtSpec };
    for (const [k, v] of Object.entries(tuning)) {
      if (v !== undefined) out[k] = Math.round((Number(activeShirtSpec[k] || 0) + Number(v)) * 10) / 10;
    }
    return out;
  }, [activeShirtSpec, tuning]);

  const currentPrice = productionType === 'mtm' ? PRICE_MTM : PRICE_MATCH;

  async function runMatch() {
    setLoading(true);
    setError('');
    try {
      const r = await api.match({
        measurements: measurementsNumeric,
        fitPreference: fit,
        sleeveType: sleeve,
        neckType: neck,
        lengthPreference: lengthPref,
      });
      setMatch(r);
      setTuning({});
    } catch (e) {
      setError(e.message || 'Matching fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  async function goToStep2() {
    if (!filled) return;
    setStep(2);
  }
  async function goToStep3() {
    setStep(3);
    if (!match) await runMatch();
  }

  async function submitOrder() {
    setLoading(true);
    setError('');
    try {
      const isMtm = productionType === 'mtm';
      const order = await api.createOrder({
        productionType,
        patternId: isMtm ? null : match.patternId,
        patternName: isMtm ? null : match.patternName,
        fitGroup: match.fitGroup,
        color,
        sleeveType: sleeve,
        neckType: neck,
        lengthPreference: lengthPref,
        measurements: measurementsNumeric,
        shirtMeasurements: tunedShirtMeasurements,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          address: customer.address,
        },
        website: customer.website, // honeypot
        price: currentPrice,
        matchScore: isMtm ? 100 : match.matchScore,
      });
      // Clear the draft on success so a fresh wizard starts next time.
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      navigate(`/bestellung/${order.orderId}`);
    } catch (e) {
      setError(e.message || 'Bestellung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <WizardSteps current={step} />

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start gap-2">
          <CircleAlert size={18} className="mt-0.5 flex-shrink-0" /> <span>{error}</span>
        </div>
      )}

      {step === 1 && (
        <div className="card p-6 sm:p-10 animate-fade-in">
          <h2 className="text-2xl font-semibold text-primary mb-2">Deine Koerpermasse</h2>
          <p className="text-primary-400 text-sm mb-8">Alle Felder sind Pflicht. Fahre mit der Maus ueber das Fragezeichen fuer eine Mess-Anleitung.</p>

          <div className="grid sm:grid-cols-2 gap-5">
            {MEASUREMENT_FIELDS.map((f) => (
              <MeasurementInput
                key={f.key}
                id={f.key}
                label={f.label}
                min={f.min}
                max={f.max}
                unit={f.unit || 'cm'}
                hint={f.hint}
                value={measurements[f.key]}
                warningRange={f.warning}
                onChange={(v) => setMeasurements((m) => ({ ...m, [f.key]: v }))}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <button className="btn-primary" disabled={!filled} onClick={goToStep2}>
              Weiter <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card p-6 sm:p-10 animate-fade-in">
          <h2 className="text-2xl font-semibold text-primary mb-2">Wie soll dein Shirt sitzen?</h2>
          <p className="text-primary-400 text-sm mb-8">Waehle deine Wunsch-Passform und Optionen.</p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
            {FIT_OPTIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => setFit(o.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left
                  ${fit === o.id ? 'border-primary bg-primary-50' : 'border-primary-100 hover:border-primary-200'}`}
              >
                <div className="flex justify-center mb-2"><FitSilhouette fit={o.id} active={fit === o.id} /></div>
                <div className="font-medium text-primary text-sm">{o.label}</div>
                <div className="text-xs text-primary-400 mt-1">{o.desc}</div>
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <OptionPicker label="Aermellaenge" options={SLEEVE_OPTIONS} value={sleeve} onChange={setSleeve} />
            <OptionPicker label="Kragenform" options={NECK_OPTIONS} value={neck} onChange={setNeck} />
            <OptionPicker label="Shirt-Laenge" options={LENGTH_OPTIONS} value={lengthPref} onChange={setLengthPref} />
          </div>

          <div className="mt-10 flex justify-between">
            <button className="btn-ghost" onClick={() => setStep(1)}>
              <ArrowLeft size={18} /> Zurueck
            </button>
            <button className="btn-primary" onClick={goToStep3}>
              Weiter <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          {match && (
            <div className="card p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-primary mb-1">Wie soll dein Shirt produziert werden?</h3>
              <p className="text-sm text-primary-400 mb-5">Du kannst spaeter nicht mehr wechseln.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setProductionType('match')}
                  className={`text-left p-5 rounded-xl border-2 transition-all
                    ${productionType === 'match' ? 'border-primary bg-primary-50' : 'border-primary-100 hover:border-primary-200'}`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-semibold text-primary">Smart Match</span>
                    <span className="text-xl font-semibold text-primary">{PRICE_MATCH} €</span>
                  </div>
                  <ul className="text-sm text-primary-500 space-y-1">
                    <li>+ Algorithmus waehlt aus 80 Schnitten den besten</li>
                    <li>+ Lieferung in 10–14 Werktagen</li>
                    <li>+ Passgenauigkeit aktuell: <strong>{match.matchScore}%</strong></li>
                  </ul>
                </button>
                <button
                  onClick={() => setProductionType('mtm')}
                  className={`text-left p-5 rounded-xl border-2 transition-all relative
                    ${productionType === 'mtm' ? 'border-primary bg-primary-50' : 'border-primary-100 hover:border-primary-200'}`}
                >
                  <span className="absolute -top-2 right-4 bg-accent text-primary text-xs px-2 py-0.5 rounded-full font-medium">100% Mass</span>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-semibold text-primary">Made-to-Measure</span>
                    <span className="text-xl font-semibold text-primary">{PRICE_MTM} €</span>
                  </div>
                  <ul className="text-sm text-primary-500 space-y-1">
                    <li>+ Schnitt exakt nach deinen Massen</li>
                    <li>+ Einzelanfertigung in EU-Manufaktur</li>
                    <li>+ Lieferung in 3–4 Wochen</li>
                  </ul>
                </button>
              </div>
            </div>
          )}

          <div className="card p-6 sm:p-10">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              {productionType === 'mtm' ? 'Deine Mass-Spezifikation' : 'Deine Passform'}
            </h2>

            {loading && !match && (
              <div className="flex items-center gap-3 text-primary-400 py-8">
                <Loader2 size={20} className="animate-spin" /> Wir berechnen deinen Schnitt...
              </div>
            )}

            {match && (
              <>
                <div className="flex flex-wrap items-baseline gap-3 mb-4">
                  {productionType === 'mtm' ? (
                    <>
                      <div className="text-3xl font-semibold text-primary">100%</div>
                      <div className="text-primary-400">Massanfertigung — exakt nach deinen Massen</div>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-semibold text-primary">{match.matchScore}%</div>
                      <div className="text-primary-400">Match — {match.patternName}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        match.confidence === 'high' ? 'bg-green-100 text-green-700' :
                        match.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{match.confidence}</span>
                    </>
                  )}
                </div>

                {productionType === 'match' && match.outlier && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm mb-4">
                    Dein Koerpertyp passt nicht perfekt zu unseren Standard-Schnitten —
                    wir empfehlen dir die <button onClick={() => setProductionType('mtm')} className="underline font-medium">Made-to-Measure-Option</button>
                    {' '}fuer maximale Passgenauigkeit.
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    ['chest', 'Brustweite'],
                    ['shoulder', 'Schulterbreite'],
                    ['upperArm', 'Aermel-Umfang'],
                    ['armLength', 'Aermellaenge'],
                    ['backLength', 'Rueckenlaenge'],
                    ['neckWidth', 'Kragenweite'],
                  ].map(([k, lbl]) => (
                    <TuneRow
                      key={k}
                      label={lbl}
                      base={match.shirtMeasurements[k]}
                      tuned={tunedShirtMeasurements[k]}
                      value={tuning[k] || 0}
                      onChange={(v) => setTuning((t) => ({ ...t, [k]: v }))}
                    />
                  ))}
                </div>

                {productionType === 'match' && match.alternatives?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-primary-100">
                    <div className="text-xs text-primary-400 uppercase tracking-wider mb-2">Alternative Schnitte</div>
                    <div className="flex flex-wrap gap-2">
                      {match.alternatives.map((a) => (
                        <span key={a.patternId} className="text-xs px-3 py-1 bg-primary-50 text-primary-600 rounded-full">
                          {a.patternName} ({a.matchScore}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="card p-6 sm:p-10">
            <h3 className="text-xl font-semibold text-primary mb-4">Farbe waehlen</h3>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  title={c.label}
                  className={`aspect-square rounded-full transition-all
                    ${color === c.id ? 'ring-4 ring-primary scale-110' : 'ring-1 ring-primary-200 hover:scale-105'}`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.label}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-primary-400">Gewaehlt: {COLORS.find((c) => c.id === color)?.label}</p>
          </div>

          <div className="card p-6 sm:p-10">
            <h3 className="text-xl font-semibold text-primary mb-6">Bestellung abschliessen</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Vorname</label>
                <input className="input" value={customer.firstName}
                  onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} />
              </div>
              <div>
                <label className="label">Nachname</label>
                <input className="input" value={customer.lastName}
                  onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">E-Mail</label>
                <input type="email" className="input" value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Lieferadresse (Strasse, Hausnr., PLZ, Ort)</label>
                <textarea rows={3} className="input" value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
              </div>
              {/* Honeypot: invisible to humans, bots fill it. Server rejects orders with this set. */}
              <input
                type="text"
                name="website"
                value={customer.website || ''}
                onChange={(e) => setCustomer({ ...customer, website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', opacity: 0 }}
              />
            </div>

            <div className="mt-6 space-y-3 border-t border-primary-100 pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={acceptedAgb}
                  onChange={(e) => setAcceptedAgb(e.target.checked)}
                />
                <span className="text-sm text-primary-600">
                  Ich habe die <Link to="/agb" target="_blank" className="text-primary underline">AGB</Link> und{' '}
                  <Link to="/datenschutz" target="_blank" className="text-primary underline">Datenschutzerklaerung</Link>{' '}
                  gelesen und akzeptiere sie.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={acceptedWiderruf}
                  onChange={(e) => setAcceptedWiderruf(e.target.checked)}
                />
                <span className="text-sm text-primary-600">
                  Mir ist bewusst, dass dieses T-Shirt nach meinen Massen einzeln gefertigt wird
                  und daher <strong>kein Widerrufsrecht</strong> besteht (§312g Abs. 2 Nr. 1 BGB).
                  Details: <Link to="/widerruf" target="_blank" className="text-primary underline">Widerrufsbelehrung</Link>.
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-semibold text-primary">{currentPrice} €</div>
                <div className="text-xs text-primary-400">
                  {productionType === 'mtm'
                    ? 'Massanfertigung · 3–4 Wochen · inkl. MwSt., versandkostenfrei DE'
                    : 'Smart Match · 10–14 Werktage · inkl. MwSt., versandkostenfrei DE'}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-ghost" onClick={() => setStep(2)}>
                  <ArrowLeft size={18} /> Zurueck
                </button>
                <button
                  className="btn-primary"
                  onClick={submitOrder}
                  disabled={
                    loading || !match ||
                    !customer.firstName || !customer.lastName ||
                    !customer.email || !customer.address ||
                    !acceptedAgb || !acceptedWiderruf
                  }
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                  Jetzt bestellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptionPicker({ label, options, value, onChange }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`px-4 py-2 rounded-md border text-sm transition-colors
              ${value === o.id
                ? 'border-primary bg-primary text-cream'
                : 'border-primary-200 hover:border-primary-400'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TuneRow({ label, base, tuned, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="text-sm text-primary-500 flex-1">{label}</div>
      <div className="text-sm text-primary tabular-nums w-16 text-right">{tuned} cm</div>
      <div className="flex items-center gap-1">
        <button
          className="w-7 h-7 rounded border border-primary-200 text-primary-500 hover:bg-primary-50 disabled:opacity-30"
          disabled={value <= -2}
          onClick={() => onChange(Math.max(-2, Math.round((value - 0.5) * 10) / 10))}
        >−</button>
        <span className="text-xs text-primary-400 w-12 text-center tabular-nums">
          {value > 0 ? `+${value}` : value} cm
        </span>
        <button
          className="w-7 h-7 rounded border border-primary-200 text-primary-500 hover:bg-primary-50 disabled:opacity-30"
          disabled={value >= 2}
          onClick={() => onChange(Math.min(2, Math.round((value + 0.5) * 10) / 10))}
        >+</button>
      </div>
    </div>
  );
}
