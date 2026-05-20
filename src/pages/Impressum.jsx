// Rechtshinweis: Diese Seite ist eine Vorlage und kein Anwaltsdokument.
// VOR der ersten kommerziellen Bestellung mit den eigenen Daten ausfuellen
// und idealerweise von einem Anwalt oder e-recht24.de pruefen lassen.
//
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

      <Banner>
        <strong>Hinweis:</strong> Diese Vorlage ist noch nicht ausgefuellt.
        Trage hier deine Daten ein, bevor du die Seite oeffentlich machst —
        ein unvollstaendiges Impressum ist abmahnf&auml;hig.
      </Banner>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-primary mb-2">Anbieter</h2>
        <p className="text-primary-600 whitespace-pre-line">
          {`[DEIN_VOR_UND_NACHNAME]
[STRASSE_UND_HAUSNUMMER]
[PLZ_UND_ORT]
Deutschland`}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Kontakt</h2>
        <p className="text-primary-600 whitespace-pre-line">
          {`Telefon: [DEINE_TELEFONNUMMER]
E-Mail: [DEINE_KONTAKT_EMAIL]`}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Umsatzsteuer-Identifikationsnummer</h2>
        <p className="text-primary-600">
          [DEINE_USt_IdNr_NACH_§27a_UStG]
          <br />
          <span className="text-sm text-primary-400">
            Entfaellt bei Kleinunternehmern nach §19 UStG. In diesem Fall stattdessen:<br />
            &bdquo;Gem&auml;ss §19 UStG wird keine Umsatzsteuer berechnet.&ldquo;
          </span>
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Verantwortlich fuer den Inhalt nach §55 Abs. 2 RStV</h2>
        <p className="text-primary-600 whitespace-pre-line">
          {`[DEIN_VOR_UND_NACHNAME]
[STRASSE_UND_HAUSNUMMER]
[PLZ_UND_ORT]`}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">EU-Streitschlichtung</h2>
        <p className="text-primary-600">
          Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung
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
          Als Diensteanbieter sind wir gem&auml;ss §7 Abs.1 TMG fuer eigene Inhalte auf
          diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
          TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, uebermittelte oder
          gespeicherte fremde Informationen zu ueberwachen.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-primary mb-2">Urheberrecht</h2>
        <p className="text-primary-600">
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung,
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
