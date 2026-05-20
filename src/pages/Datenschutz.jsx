// Rechtshinweis: Vorlage. Vor Live-Gang von Anwalt oder e-recht24.de pruefen lassen.
// Diese Erklaerung deckt das aktuelle FitShirt-MVP ab:
// - Hosting: Vercel (US-Konzern mit EU-Rechenzentrum + SCCs)
// - Datenbank: Turso (libsql-Cloud, EU-Region waehlbar)
// - Schriftarten: Google Fonts (laed Inter — bei Bedarf lokal hosten, um IP-Transfer zu vermeiden)
// - Bestelldaten: werden bei Bestellung uebermittelt und gespeichert.

export default function Datenschutz() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-primary mb-8">Datenschutzerkl&auml;rung</h1>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-sm mb-8">
        <strong>Hinweis:</strong> Diese Vorlage ist noch nicht final. Bevor du echte
        Bestellungen annimmst, lass sie pruefen und passe die Platzhalter an.
      </div>

      <Section title="1. Verantwortlicher">
        <p className="whitespace-pre-line">
          {`Verantwortlich im Sinne der DSGVO ist:

[DEIN_VOR_UND_NACHNAME]
[STRASSE_UND_HAUSNUMMER]
[PLZ_UND_ORT]
E-Mail: [DEINE_KONTAKT_EMAIL]`}
        </p>
      </Section>

      <Section title="2. Welche Daten wir verarbeiten">
        <p>Wir verarbeiten folgende personenbezogene Daten:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li><strong>Bei einer Bestellung:</strong> Vor- und Nachname, E-Mail, Lieferadresse,
            Koerpermasse (Groesse, Brust-, Schulter-, Arm-, Taillen-, Hueftumfang u.a.) sowie
            Bestelldetails (Schnitt, Farbe, Aermel-/Kragenwahl).</li>
          <li><strong>Bei jedem Aufruf der Seite:</strong> IP-Adresse (anonymisiert durch Hoster),
            Datum/Uhrzeit, abgerufene URL, ueblicherweise im Server-Log fuer max. 14 Tage.</li>
        </ul>
      </Section>

      <Section title="3. Zweck und Rechtsgrundlage">
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>Vertragserfuellung (Art. 6 Abs. 1 lit. b DSGVO):</strong> Verarbeitung
            deiner Bestelldaten zur Anfertigung und Lieferung des Shirts.</li>
          <li><strong>Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO):</strong> Server-Log
            zur Betriebssicherheit.</li>
          <li><strong>Gesetzliche Pflicht (Art. 6 Abs. 1 lit. c DSGVO):</strong> Aufbewahrung
            von Rechnungsdaten 10 Jahre gem. §147 AO.</li>
        </ul>
      </Section>

      <Section title="4. Empf&auml;nger und Auftragsverarbeiter">
        <p>Folgende Dienstleister verarbeiten Daten in unserem Auftrag:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li><strong>Vercel Inc.</strong> (Hosting der Webseite, EU-Server) — Auftragsverarbeitungsvertrag
            geschlossen.</li>
          <li><strong>Turso (ChiselStrike Inc.)</strong> (Datenbank, EU-Region) — Auftragsverarbeitungsvertrag
            geschlossen.</li>
          <li><strong>Google Fonts:</strong> Die Schriftart Inter wird derzeit ueber das Google-Fonts-CDN
            geladen. Dabei wird deine IP-Adresse an Google uebermittelt. Wir empfehlen, die
            Schriftart vor Live-Gang lokal zu hosten — oder hier explizit zu nennen.</li>
          <li><strong>[VERSANDDIENSTLEISTER, sobald gewaehlt z.B. DHL]:</strong> erhaelt
            Name + Adresse zur Zustellung.</li>
          <li><strong>[ZAHLUNGSDIENSTLEISTER, sobald integriert z.B. Stripe]:</strong> erhaelt
            Bestellsumme + Kundenname zur Zahlungsabwicklung.</li>
        </ul>
      </Section>

      <Section title="5. Speicherdauer">
        <ul className="list-disc ml-5 space-y-1">
          <li>Bestelldaten: bis zur vollst&auml;ndigen Vertragsabwicklung, dann 10 Jahre
            (steuerrechtlich).</li>
          <li>Koerpermasse: 2 Jahre nach Bestellung (fuer Reklamation und Nachbestellung).</li>
          <li>Server-Logs: max. 14 Tage.</li>
        </ul>
      </Section>

      <Section title="6. Deine Rechte">
        <p>Nach der DSGVO hast du folgende Rechte:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>L&ouml;schung (Art. 17 DSGVO) — soweit keine Aufbewahrungspflichten entgegenstehen</li>
          <li>Einschr&auml;nkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Daten&uuml;bertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch (Art. 21 DSGVO)</li>
          <li>Beschwerde bei einer Aufsichtsbehoerde (Art. 77 DSGVO)</li>
        </ul>
        <p className="mt-2">
          Anfragen bitte an: <a className="text-primary underline" href="mailto:[DEINE_KONTAKT_EMAIL]">[DEINE_KONTAKT_EMAIL]</a>
        </p>
      </Section>

      <Section title="7. Cookies">
        <p>
          Diese Webseite verwendet derzeit keine Tracking- oder Marketing-Cookies.
          Im Admin-Bereich wird ein technisch notwendiger sessionStorage-Eintrag fuer
          den Admin-Login verwendet (kein Cookie).
        </p>
      </Section>

      <Section title="8. &Auml;nderungen">
        <p>
          Wir behalten uns vor, diese Datenschutzerkl&auml;rung anzupassen, damit sie
          stets den aktuellen rechtlichen Anforderungen entspricht. Stand: {new Date().getFullYear()}.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
      <div className="text-primary-600 leading-relaxed">{children}</div>
    </section>
  );
}
