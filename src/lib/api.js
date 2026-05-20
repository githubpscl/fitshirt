// Tiny fetch wrapper used by all pages.

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (isJson && payload?.error) || `Fehler ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

export const api = {
  match: (body) => request('/api/match', { method: 'POST', body }),
  createOrder: (body) => request('/api/order', { method: 'POST', body }),
  getOrder: (id, adminPassword) => request(`/api/orders/${id}`, {
    headers: adminPassword ? { 'x-admin-password': adminPassword } : {},
  }),
  listOrders: (adminPassword, status) => request(
    `/api/orders${status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : ''}`,
    { headers: { 'x-admin-password': adminPassword } },
  ),
  updateOrderStatus: (id, status, adminPassword) => request(`/api/orders/${id}`, {
    method: 'PATCH',
    body: { status },
    headers: { 'x-admin-password': adminPassword },
  }),
  patterns: () => request('/api/patterns'),
  inventory: (adminPassword) => request('/api/inventory', {
    headers: { 'x-admin-password': adminPassword },
  }),
};

export const COLORS = [
  { id: 'weiss',     label: 'Weiss',          hex: '#ffffff', border: true },
  { id: 'schwarz',   label: 'Schwarz',        hex: '#1a1a1a' },
  { id: 'grau_hell', label: 'Grau (hell)',    hex: '#d1d5db' },
  { id: 'grau_dunkel', label: 'Grau (dunkel)', hex: '#4b5563' },
  { id: 'navy',      label: 'Navy',           hex: '#1a2332' },
  { id: 'blau',      label: 'Blau',           hex: '#2563eb' },
  { id: 'rot',       label: 'Rot',            hex: '#dc2626' },
  { id: 'bordeaux',  label: 'Bordeaux',       hex: '#7f1d1d' },
  { id: 'oliv',      label: 'Gruen (oliv)',   hex: '#6b7c3a' },
  { id: 'forest',    label: 'Gruen (forest)', hex: '#1f4d2c' },
  { id: 'beige',     label: 'Beige',          hex: '#d9c9a3' },
  { id: 'braun',     label: 'Braun',          hex: '#6b4423' },
  { id: 'gelb',      label: 'Gelb',           hex: '#facc15' },
  { id: 'orange',    label: 'Orange',         hex: '#ea580c' },
  { id: 'rosa',      label: 'Rosa',           hex: '#f9a8d4' },
  { id: 'lila',      label: 'Lila',           hex: '#7e22ce' },
];

export const STATUS_LABELS = {
  neu: 'Neu',
  in_produktion: 'In Produktion',
  versendet: 'Versendet',
};
