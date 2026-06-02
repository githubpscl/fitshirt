import { COMPANY, isDraft } from '../lib/company.js';

// Pflichtangaben Impressum §5 TMG fuer Unternehmen + §55 RStV:
// 1) vollstaendiger Name (bei Einzelunternehmer: Vor- und Zuname)
// 2) ladungsfaehige Anschrift (kein Postfach)
// 3) Kontakt (E-Mail + idealerweise Telefon)
// 4) Handelsregister-Nr. (falls eingetragen)
// 5) USt-IdNr. nach §27a UStG (falls vorhanden)
// 6) Aufsichtsbehoerde (selten relevant fuer Online-Shops)
// 7) bei journalistischen Inhalten: V.i.S.d.P.

export default function Impressum() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-stone">
      <h1 className="text-3xl font-semibold text-primary mb-8">Impressum</h1>

      {isDraft && (
        <Banner>
          <strong>Hinweis:</strong> Diese Daten sind noch Platzhalter.{' '}
          Trage in <code className="bg-amber-100 px-1 rounded">src/lib/company.js</code>{' '}
          deine echten Daten ein, bevor du die Seite oeffentlich machst —
          ein unvollstaendiges Impressum ist abmahnfaehig.
        </Banner>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-primary mb-2">Anbieter</h2>
        <p className="text-primary-600 whitespace-pre-line">
          {COMPANY.name}{'\n'}{COMPANY.street}{'\n'}{COMPANY.cityZip}{'\n'}{COMPANY.country}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Kontakt</h2>
        <p className="text-primary-600 whitespace-pre-line">
          Telefon: {COMPANY.phone}{'\n'}E-Mail: {COMPANY.email}
        </p>
      </section>

      {COMPANY.registry && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-primary mb-2">Handelsregister</h2>
          <p className="text-primary-600">{COMPANY.registry}</p>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Umsatzsteuer-Identifikationsnummer</h2>
        {COMPANY.vatId ? (
          <p className="text-primary-600">{COMPANY.vatId}</p>
        ) : (
          <p className="text-primary-600">
            Gemaess §19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmer-Regelung).
          </p>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Verantwortlich fuer den Inhalt nach §55 Abs. 2 RStV</h2>
        <p className="text-primary-600 whitespace-pre-line">
          {COMPANY.name}{'\n'}{COMPANY.street}{'\n'}{COMPANY.cityZip}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">EU-Streitschlichtung</h2>
        <p className="text-primary-600">
          Die Europaeische Kommission stellt eine Plattform zur Online-Streitbeilegung
          (OS) bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr/" className="text-primary underline"
             target="_blank" rel="noreferrer">https://ec.europa.eu/consumers/odr/</a>.
          Unsere E-Mail-Adresse findest du oben im Impressum.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Verbraucherstreitbeilegung</h2>
        <p className="text-primary-600">
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Haftung fuer Inhalte</h2>
        <p className="text-primary-600">
          Als Diensteanbieter sind wir gemaess §7 Abs.1 TMG fuer eigene Inhalte auf
          diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
          TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, uebermittelte oder
          gespeicherte fremde Informationen zu ueberwachen.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Urheberrecht</h2>
        <p className="text-primary-600">
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Die Vervielfaeltigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes
          beduerfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>
      </section>
    </div>
  );
}

function Banner({ children }) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-sm">
      {children}
    </div>
  );
}
