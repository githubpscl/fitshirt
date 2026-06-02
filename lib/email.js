// Email sender via Resend (https://resend.com) — 100 mails/day, 3000/month free.
// Uses fetch instead of the npm package so no extra dependency is required.
//
// Env vars (all optional; if RESEND_API_KEY is missing, sending is a no-op):
//   RESEND_API_KEY  — your Resend API key
//   RESEND_FROM     — verified sender email (default: "FitShirt <onboarding@resend.dev>")
//   ADMIN_EMAIL     — receives the internal new-order notification
//   PUBLIC_URL      — base URL used in mail links (default: https://fitshirt-roan.vercel.app)

const PUBLIC_URL = process.env.PUBLIC_URL || 'https://fitshirt-roan.vercel.app';
const DEFAULT_FROM = 'FitShirt <onboarding@resend.dev>';

function getConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM || DEFAULT_FROM,
    adminEmail: process.env.ADMIN_EMAIL,
  };
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendViaResend({ to, subject, html, text, replyTo }) {
  const { apiKey, from } = getConfig();
  if (!apiKey) return { skipped: true, reason: 'no RESEND_API_KEY' };

  const body = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  };
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 200)}`);
  }
  return res.json();
}

function formatMeasurements(m) {
  if (!m) return '';
  const labels = {
    chest: 'Brustweite', shoulder: 'Schulterbreite', upperArm: 'Aermelumfang',
    armLength: 'Aermellaenge', backLength: 'Rueckenlaenge', neckWidth: 'Kragenweite',
    waist: 'Taille',
  };
  return Object.entries(m)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b7280">${escapeHtml(labels[k] || k)}</td><td style="padding:4px 0;font-weight:500">${escapeHtml(String(v))} cm</td></tr>`)
    .join('');
}

function customerHtml(order) {
  const productionLine = order.productionType === 'mtm'
    ? 'Made-to-Measure — exakte Massanfertigung'
    : `Smart Match — ${escapeHtml(order.patternName || '')} (${escapeHtml(order.patternId || '')})`;
  const deliveryLine = order.productionType === 'mtm'
    ? 'Lieferung in 3-4 Wochen (Einzelanfertigung in EU-Manufaktur).'
    : 'Lieferung in 10-14 Werktagen.';

  return `<!doctype html>
<html lang="de"><body style="margin:0;padding:0;background:#f8f6f1;font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#1a2332">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <h1 style="font-size:24px;margin:0 0 8px 0">Danke fuer deine Bestellung!</h1>
    <p style="color:#4b5563;margin:0 0 24px 0">Bestellnummer: <strong>${escapeHtml(order.id)}</strong></p>

    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:16px">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;margin-bottom:4px">Produktion</div>
      <div style="margin-bottom:12px">${productionLine}</div>
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;margin-bottom:4px">Farbe</div>
      <div style="margin-bottom:12px">${escapeHtml(order.color || '')}</div>
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;margin-bottom:4px">Shirt-Masse</div>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${formatMeasurements(order.shirtMeasurements)}</table>
    </div>

    <p style="color:#4b5563">${deliveryLine} Sobald dein Shirt unterwegs ist, bekommst du eine weitere Mail.</p>

    <p style="margin-top:32px">
      <a href="${PUBLIC_URL}/bestellung/${encodeURIComponent(order.id)}" style="background:#1a2332;color:#f8f6f1;padding:12px 20px;text-decoration:none;border-radius:8px;display:inline-block">Bestellung ansehen</a>
    </p>

    <p style="color:#9ca3af;font-size:12px;margin-top:48px">FitShirt - Massgeschneiderte T-Shirts. Du erhaeltst diese Mail, weil du auf ${PUBLIC_URL} bestellt hast.</p>
  </div>
</body></html>`;
}

function customerText(order) {
  const lines = [
    `Danke fuer deine Bestellung bei FitShirt!`,
    ``,
    `Bestellnummer: ${order.id}`,
    `Produktion: ${order.productionType === 'mtm' ? 'Made-to-Measure' : `Smart Match (${order.patternName || ''})`}`,
    `Farbe: ${order.color}`,
    ``,
    `Bestellung ansehen: ${PUBLIC_URL}/bestellung/${order.id}`,
    ``,
    order.productionType === 'mtm'
      ? 'Lieferung in 3-4 Wochen.'
      : 'Lieferung in 10-14 Werktagen.',
  ];
  return lines.join('\n');
}

function adminHtml(order) {
  return `<!doctype html>
<html lang="de"><body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;color:#1a2332">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <h2 style="margin:0 0 16px 0">Neue Bestellung: ${escapeHtml(order.id)}</h2>
    <p><strong>${escapeHtml(`${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`)}</strong><br>
       ${escapeHtml(order.customer?.email || '')}<br>
       <span style="white-space:pre-line">${escapeHtml(order.customer?.address || '')}</span></p>
    <p><strong>Produktion:</strong> ${order.productionType === 'mtm' ? 'Made-to-Measure (129 EUR)' : `Smart Match (65 EUR) - ${escapeHtml(order.patternId || '')} - ${escapeHtml(order.patternName || '')}`}<br>
       <strong>Fit:</strong> ${escapeHtml(order.fitGroup || '')}<br>
       <strong>Farbe:</strong> ${escapeHtml(order.color || '')}<br>
       <strong>Aermel/Kragen:</strong> ${escapeHtml(order.sleeveType || '')} / ${escapeHtml(order.neckType || '')}</p>
    <h3 style="margin-top:24px">Shirt-Masse</h3>
    <table style="border-collapse:collapse;font-size:14px">${formatMeasurements(order.shirtMeasurements)}</table>
    <p style="margin-top:24px"><a href="${PUBLIC_URL}/admin">Im Admin oeffnen</a></p>
  </div>
</body></html>`;
}

export async function sendOrderEmails(order) {
  const { adminEmail } = getConfig();
  const tasks = [];

  if (order.customer?.email) {
    tasks.push(
      sendViaResend({
        to: order.customer.email,
        subject: `Bestellung ${order.id} eingegangen - FitShirt`,
        html: customerHtml(order),
        text: customerText(order),
        replyTo: adminEmail || undefined,
      }).catch((err) => ({ error: String(err.message || err), recipient: 'customer' })),
    );
  }
  if (adminEmail) {
    tasks.push(
      sendViaResend({
        to: adminEmail,
        subject: `Neue Bestellung ${order.id} (${order.productionType === 'mtm' ? 'MTM' : 'Match'})`,
        html: adminHtml(order),
        text: `Neue Bestellung ${order.id} von ${order.customer?.email}\n${PUBLIC_URL}/admin`,
        replyTo: order.customer?.email,
      }).catch((err) => ({ error: String(err.message || err), recipient: 'admin' })),
    );
  }

  if (tasks.length === 0) return { skipped: true };
  const results = await Promise.all(tasks);
  return { results };
}
