// Single source of truth for company / legal data shown on Impressum,
// Datenschutz, AGB and Widerruf.
//
// SETUP CHECKLIST before going live:
//   1. Fill in every field marked TODO below with your real data.
//   2. Make sure `name`, `street`, `cityZip` form a complete "ladungsfaehige
//      Anschrift" (no P.O. boxes — that's required by §5 TMG).
//   3. Get the texts on Datenschutz / AGB / Widerruf reviewed (or generated
//      with e-recht24.de / Trusted Shops) before you take real money.
//
// Leaving a value as "TODO_..." shows a warning banner on the legal pages.
//
// Tip: in Cowork mode just say "fuelle die Impressum-Daten aus, ich heisse ...,
// Adresse ist ..., Mail ..." and Claude will edit this file for you.

export const COMPANY = {
  // Legal name (Vor- und Zuname bei Einzelunternehmer, sonst Firma)
  name: 'TODO_DEIN_VOLLER_NAME',
  // Strasse + Hausnummer
  street: 'TODO_STRASSE_HAUSNUMMER',
  // PLZ + Stadt
  cityZip: 'TODO_PLZ_ORT',
  country: 'Deutschland',

  // Kontakt
  email: 'TODO_DEINE_KONTAKT_EMAIL',
  phone: 'TODO_DEINE_TELEFONNUMMER',

  // USt-IdNr. nach §27a UStG — leer lassen wenn Kleinunternehmer §19 UStG.
  // Wenn leer, zeigt Impressum den §19-Hinweis stattdessen an.
  vatId: '',

  // Handelsregister, falls eingetragen. Beispiel: 'Amtsgericht Berlin, HRB 12345'
  registry: '',

  // Branding / öffentliche Daten
  brand: 'FitShirt',
  publicUrl: 'https://fitshirt-roan.vercel.app',

  // Geschäftsdaten
  vatRatePct: 19,             // Mehrwertsteuersatz für die AGB
  deliveryDays: '10-14',      // Smart Match
  mtmDeliveryWeeks: '3-4',    // Made-to-Measure
  priceMatch: 65,
  priceMtm: 129,
  shipping: 'Versandkostenfrei innerhalb Deutschlands.',

  // Wenn aktiviert, zeigen die Rechtsseiten oben den "Vorlage"-Warnbanner.
  // Wird automatisch aus den TODO_-Werten unten abgeleitet.
};

const allTodos = [COMPANY.name, COMPANY.street, COMPANY.cityZip, COMPANY.email, COMPANY.phone];
export const isDraft = allTodos.some((v) => typeof v === 'string' && v.startsWith('TODO_'));
