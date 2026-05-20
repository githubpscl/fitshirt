// Widerrufsbelehrung mit Ausschluss-Hinweis fuer Massanfertigung.
// Die Information ueber den Ausschluss muss VOR Vertragsschluss gegeben werden,
// sonst gilt das 14-Tage-Widerrufsrecht trotzdem.

export default function Widerruf() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-primary mb-8">Widerrufsbelehrung &amp; Ausschluss</h1>

      <div className="p-4 bg-primary-50 border border-primary-200 rounded-md text-primary-700 text-sm mb-8">
        <strong>Kurzfassung:</strong> Da jedes Shirt nach deinen K&ouml;rpermassen
        einzeln gefertigt wird, besteht <strong>kein 14-t&auml;giges Widerrufsrecht</strong>{' '}
        (§312g Abs. 2 Nr. 1 BGB). Die gesetzliche M&auml;ngelhaftung bleibt davon
        unber&uuml;hrt — wenn ein Verarbeitungsfehler vorliegt, wenden dich bitte direkt
        an uns.
      </div>

      <Section title="Wann das Widerrufsrecht entf&auml;llt">
        <p>
          Nach §312g Abs. 2 Nr. 1 BGB ist das Widerrufsrecht ausgeschlossen bei Vertr&auml;gen{' '}
          <em>&bdquo;zur Lieferung von Waren, die nicht vorgefertigt sind und fuer deren
          Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher
          massgeblich ist oder die eindeutig auf die persoenlichen Beduerfnisse des
          Verbrauchers zugeschnitten sind.&ldquo;</em>
        </p>
        <p className="mt-2">
          Genau das trifft auf jedes T-Shirt von FitShirt zu: Schnitt, Massform, Farbe
          und Detailoptionen werden bei jeder Bestellung individuell konfiguriert und in
          Einzelfertigung produziert.
        </p>
      </Section>

      <Section title="Was du bei Problemen tun kannst">
        <ol className="list-decimal ml-5 space-y-2">
          <li>
            <strong>Verarbeitungs- oder Materialfehler:</strong> Du hast die gesetzlichen
            Gew&auml;hrleistungsrechte. Melde den Fehler innerhalb von 14 Tagen ab Erhalt
            an <a href="mailto:[DEINE_KONTAKT_EMAIL]" className="text-primary underline">[DEINE_KONTAKT_EMAIL]</a>.
          </li>
          <li>
            <strong>Passform stimmt nicht:</strong> Sofern keine Eingabefehler bei den
            Massen vorliegen, bemuehen wir uns kulanzweise um eine Nachbesserung oder
            Anpassung. Schicke uns eine Mail mit Beschreibung und nach M&ouml;glichkeit
            Foto.
          </li>
          <li>
            <strong>Falsche Lieferung:</strong> Wenn du ein anderes Produkt erhalten hast
            als bestellt, melde dich umgehend — wir kl&auml;ren das schnellstm&ouml;glich.
          </li>
        </ol>
      </Section>

      <Section title="Ausnahme: Wenn du dich bei der Bestellung verklickt hast">
        <p>
          Wenn du innerhalb von 1 Stunde nach Bestellung merkst, dass du falsche Masse
          eingegeben hast, schreib uns sofort — solange die Produktion noch nicht
          gestartet ist, korrigieren wir die Daten kostenfrei. Nach Produktionsstart ist
          eine &Auml;nderung nicht mehr m&ouml;glich.
        </p>
      </Section>

      <p className="text-sm text-primary-400 mt-8">
        Stand: {new Date().toLocaleDateString('de-DE')}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-primary mb-2">{title}</h2>
      <div className="text-primary-600 leading-relaxed">{children}</div>
    </section>
  );
}
