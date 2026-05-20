// Rechtshinweis: Vorlage. Vor Live-Gang anwaltlich pruefen.
// Wichtigster Punkt: §312g Abs. 2 Nr. 1 BGB schliesst das Widerrufsrecht bei
// Massanfertigung aus — der Kunde muss darueber explizit informiert werden,
// idealerweise mit Checkbox bei Bestellung.

export default function AGB() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-primary mb-8">Allgemeine Gesch&auml;ftsbedingungen</h1>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-sm mb-8">
        <strong>Hinweis:</strong> Diese AGB sind eine Vorlage. Vor dem Verkauf an Verbraucher
        rechtlich pruefen lassen.
      </div>

      <Section title="§ 1 Geltungsbereich, Anbieter">
        <p>
          Diese Allgemeinen Gesch&auml;ftsbedingungen (AGB) gelten fuer alle Bestellungen,
          die Verbraucher und Unternehmer ueber unseren Online-Shop &uuml;ber{' '}
          <span className="font-mono text-sm">fitshirt-roan.vercel.app</span> bei
        </p>
        <p className="whitespace-pre-line mt-2">
          {`[DEIN_VOR_UND_NACHNAME]
[STRASSE_UND_HAUSNUMMER]
[PLZ_UND_ORT]
E-Mail: [DEINE_KONTAKT_EMAIL]`}
        </p>
        <p className="mt-2">
          (nachfolgend &bdquo;Anbieter&ldquo;) abschliessen. Verbraucher im Sinne dieser AGB
          ist jede natuerliche Person, die ein Rechtsgesch&auml;ft zu Zwecken abschliesst,
          die ueberwiegend weder ihrer gewerblichen noch ihrer selbst&auml;ndigen
          beruflichen T&auml;tigkeit zugerechnet werden koennen.
        </p>
      </Section>

      <Section title="§ 2 Vertragsschluss">
        <p>
          Die Darstellung der Produkte im Online-Shop stellt kein verbindliches Angebot dar.
          Durch das Anklicken des Bestell-Buttons gibt der Kunde ein verbindliches Angebot
          ab. Der Anbieter best&auml;tigt den Eingang der Bestellung umgehend per E-Mail.
          Diese Best&auml;tigung stellt noch keine Annahme des Angebots dar. Der Vertrag
          kommt zustande, sobald der Anbieter die Bestellung ausdr&uuml;cklich annimmt oder
          die Ware versendet.
        </p>
      </Section>

      <Section title="§ 3 Massanfertigung — kein Widerrufsrecht">
        <p>
          Jedes bei uns bestellte T-Shirt wird auf Basis der vom Kunden eingegebenen
          K&ouml;rpermasse und gew&auml;hlten Spezifikationen (Fit, Farbe, &Auml;rmel-,
          Kragenform, L&auml;nge) <strong>individuell gefertigt</strong>. Damit liegt eine
          nach Kundenwunsch angefertigte Ware im Sinne des §312g Abs. 2 Nr. 1 BGB vor.
        </p>
        <p className="mt-2">
          <strong>Das gesetzliche 14-t&auml;gige Widerrufsrecht ist daher ausgeschlossen.</strong>{' '}
          Der Kunde best&auml;tigt diesen Ausschluss durch Anklicken der entsprechenden
          Checkbox bei der Bestellung.
        </p>
        <p className="mt-2 text-sm text-primary-400">
          Hinweis: Die gesetzliche M&auml;ngelhaftung (Gew&auml;hrleistung) bleibt davon
          unberuehrt — siehe §6.
        </p>
      </Section>

      <Section title="§ 4 Preise und Zahlung">
        <p>
          Alle Preise verstehen sich inkl. gesetzlicher Mehrwertsteuer und zzgl.
          Versandkosten (falls anwendbar; innerhalb Deutschlands derzeit versandkostenfrei).
          Der Kaufpreis ist sofort mit Bestellung f&auml;llig und wird ueber den im
          Bestellprozess gew&auml;hlten Zahlungsanbieter abgewickelt.
        </p>
        <p className="mt-2 text-sm text-primary-400">
          [Sobald Zahlungsanbieter integriert ist (z.B. Stripe, PayPal, Klarna),
          hier die konkret akzeptierten Methoden auflisten.]
        </p>
      </Section>

      <Section title="§ 5 Lieferung">
        <p>
          Die Lieferung erfolgt innerhalb von 10 bis 14 Werktagen ab Eingang der Zahlung.
          Lieferungen erfolgen ausschliesslich nach Deutschland, sofern nicht anders
          vereinbart. Der Versand erfolgt an die vom Kunden bei Bestellung angegebene
          Adresse.
        </p>
      </Section>

      <Section title="§ 6 Gew&auml;hrleistung / M&auml;ngelhaftung">
        <p>
          Es gelten die gesetzlichen M&auml;ngelhaftungsrechte. Bei einem Verarbeitungs-
          oder Materialfehler des Shirts (z.B. fehlerhafte N&auml;hte, falsche Farbe,
          eindeutige Abweichung vom bestellten Schnitt) reklamiere bitte innerhalb von
          14 Tagen nach Erhalt unter <a className="text-primary underline" href="mailto:[DEINE_KONTAKT_EMAIL]">[DEINE_KONTAKT_EMAIL]</a>.
        </p>
        <p className="mt-2">
          Wir bieten in diesem Fall Nachbesserung oder Ersatz an. <strong>Wichtig:</strong> Eine
          Passform-Abweichung, die auf einer fehlerhaften Eingabe der eigenen K&ouml;rpermasse
          beruht, stellt keinen Mangel dar.
        </p>
      </Section>

      <Section title="§ 7 Eigentumsvorbehalt">
        <p>
          Die Ware bleibt bis zur vollst&auml;ndigen Bezahlung Eigentum des Anbieters.
        </p>
      </Section>

      <Section title="§ 8 Schlussbestimmungen">
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
          UN-Kaufrechts. Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder
          werden, so bleibt die Wirksamkeit der uebrigen Bestimmungen davon unberuehrt.
        </p>
      </Section>

      <Section title="§ 9 Streitschlichtung">
        <p>
          Die EU-Kommission stellt eine Online-Plattform zur Streitbeilegung bereit:{' '}
          <a className="text-primary underline" href="https://ec.europa.eu/consumers/odr/"
             target="_blank" rel="noreferrer">https://ec.europa.eu/consumers/odr/</a>.
          Wir sind nicht bereit oder verpflichtet, an einem Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
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
