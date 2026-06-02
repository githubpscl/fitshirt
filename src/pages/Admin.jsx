import { Fragment, useEffect, useState } from 'react';
import { Lock, Download, RefreshCw, Loader2, LogOut } from 'lucide-react';
import { api, STATUS_LABELS, COLORS } from '../lib/api.js';

const STATUS_OPTIONS = ['all', 'neu', 'in_produktion', 'versendet'];

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('fitshirt_admin') || '');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [productionFilter, setProductionFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [tab, setTab] = useState('orders');

  async function tryLogin(pw) {
    setError('');
    setLoading(true);
    try {
      await api.listOrders(pw);
      sessionStorage.setItem('fitshirt_admin', pw);
      setAuthed(true);
      setPassword(pw);
    } catch (e) {
      setError('Falsches Passwort');
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (password) tryLogin(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    if (!authed) return;
    setLoading(true);
    try {
      const [o, inv] = await Promise.all([
        api.listOrders(password, statusFilter),
        api.inventory(password),
      ]);
      setOrders(o.orders || []);
      setInventory(inv.inventory || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (authed) refresh(); /* eslint-disable-next-line */ }, [authed, statusFilter]);

  async function changeStatus(id, status) {
    try {
      await api.updateOrderStatus(id, status, password);
      setOrders((os) => os.map((o) => o.id === id ? { ...o, status } : o));
    } catch (e) {
      setError(e.message);
    }
  }

  function exportCsv() {
    const url = '/api/orders-export';
    fetch(url, { headers: { 'x-admin-password': password } })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'fitshirt-orders.csv';
        a.click();
        URL.revokeObjectURL(a.href);
      });
  }

  function logout() {
    sessionStorage.removeItem('fitshirt_admin');
    setAuthed(false);
    setPassword('');
  }

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary text-cream p-2 rounded-md"><Lock size={18} /></span>
            <h1 className="text-2xl font-semibold text-primary">Admin-Login</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); tryLogin(password); }}>
            <label className="label">Passwort</label>
            <input type="password" className="input mb-4"
              value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Einloggen'}
            </button>
          </form>
          <p className="text-xs text-primary-400 mt-4 text-center">MVP-Passwort: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold text-primary">Admin-Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={refresh} className="btn-ghost">
            <RefreshCw size={16} /> Aktualisieren
          </button>
          <button onClick={exportCsv} className="btn-ghost">
            <Download size={16} /> CSV
          </button>
          <button onClick={logout} className="btn-ghost text-red-500">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-primary-100">
        {[['orders', `Bestellungen (${orders.length})`], ['inventory', 'Lagerbestand']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
              ${tab === id ? 'border-primary text-primary' : 'border-transparent text-primary-400 hover:text-primary'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div>
          <div className="space-y-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-primary-400 uppercase tracking-wider mr-1">Status:</span>
              {STATUS_OPTIONS.map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs ${statusFilter === s ? 'bg-primary text-cream' : 'bg-primary-50 text-primary-500'}`}>
                  {s === 'all' ? 'Alle' : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-primary-400 uppercase tracking-wider mr-1">Produktion:</span>
              {[['all', 'Alle'], ['match', 'Smart Match'], ['mtm', 'Made-to-Measure']].map(([id, label]) => (
                <button key={id} onClick={() => setProductionFilter(id)}
                  className={`px-3 py-1 rounded-full text-xs ${productionFilter === id ? 'bg-primary text-cream' : 'bg-primary-50 text-primary-500'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-primary-50 text-primary-500 text-left">
                  <tr>
                    <th className="p-3">Bestellnr.</th>
                    <th className="p-3">Datum</th>
                    <th className="p-3">Kunde</th>
                    <th className="p-3">Produktion</th>
                    <th className="p-3">Schnitt</th>
                    <th className="p-3">Farbe</th>
                    <th className="p-3">Status</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filteredOrders = orders.filter((o) =>
                      productionFilter === 'all' ? true : (o.productionType || 'match') === productionFilter,
                    );
                    if (filteredOrders.length === 0) {
                      return <tr><td colSpan="8" className="p-6 text-center text-primary-400">Keine Bestellungen</td></tr>;
                    }
                    return null;
                  })()}
                  {orders.filter((o) =>
                    productionFilter === 'all' ? true : (o.productionType || 'match') === productionFilter,
                  ).map((o) => {
                    const color = COLORS.find((c) => c.id === o.color);
                    const open = expanded === o.id;
                    return (
                      <Fragment key={o.id}>
                        <tr className="border-t border-primary-100 hover:bg-primary-50/50">
                          <td className="p-3 font-mono text-xs">{o.id}</td>
                          <td className="p-3 text-primary-500">{new Date(o.createdAt).toLocaleDateString('de-DE')}</td>
                          <td className="p-3">{o.customer.firstName} {o.customer.lastName}</td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              o.productionType === 'mtm'
                                ? 'bg-accent text-primary'
                                : 'bg-primary-50 text-primary-500'
                            }`}>
                              {o.productionType === 'mtm' ? 'MTM' : 'Match'}
                            </span>
                          </td>
                          <td className="p-3">{o.patternId || <span className="text-primary-300">—</span>}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-full ring-1 ring-primary-200"
                                style={{ backgroundColor: color?.hex || '#999' }} />
                              {color?.label || o.color}
                            </span>
                          </td>
                          <td className="p-3">
                            <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}
                              className="px-2 py-1 rounded border border-primary-200 bg-white text-xs">
                              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3">
                            <button className="text-primary-500 hover:text-primary text-xs"
                              onClick={() => setExpanded(open ? null : o.id)}>
                              {open ? 'Schliessen' : 'Details'}
                            </button>
                          </td>
                        </tr>
                        {open && (
                          <tr className="bg-primary-50/30 border-t border-primary-100">
                            <td colSpan="8" className="p-5">
                              <div className="grid sm:grid-cols-3 gap-6 text-xs">
                                <div>
                                  <div className="text-primary-400 uppercase tracking-wider mb-1">Kontakt</div>
                                  <div className="text-primary">{o.customer.email}</div>
                                  <div className="text-primary-500 whitespace-pre-line mt-1">{o.customer.address}</div>
                                </div>
                                <div>
                                  <div className="text-primary-400 uppercase tracking-wider mb-1">Koerpermasse</div>
                                  {Object.entries(o.measurements || {}).map(([k, v]) => (
                                    <div key={k} className="flex justify-between"><span className="text-primary-500">{k}</span><span>{v}</span></div>
                                  ))}
                                </div>
                                <div>
                                  <div className="text-primary-400 uppercase tracking-wider mb-1">Shirt-Masse</div>
                                  {Object.entries(o.shirtMeasurements || {}).map(([k, v]) => (
                                    <div key={k} className="flex justify-between"><span className="text-primary-500">{k}</span><span>{v} cm</span></div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'inventory' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 text-primary-500 text-left">
                <tr>
                  <th className="p-3">Schnitt-ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Fit-Gruppe</th>
                  <th className="p-3 text-right">Bestellungen</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((row) => (
                  <tr key={row.patternId} className="border-t border-primary-100">
                    <td className="p-3 font-mono text-xs">{row.patternId}</td>
                    <td className="p-3">{row.name}</td>
                    <td className="p-3 capitalize">{row.fitGroup}</td>
                    <td className="p-3 text-right tabular-nums">{row.ordersTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
