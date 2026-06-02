# FitShirt

**Live:** <https://fitshirt-roan.vercel.app>
**Admin:** <https://fitshirt-roan.vercel.app/admin> (Passwort: `admin123` per Default — bitte aendern, siehe unten)
**Repo:** <https://github.com/githubpscl/fitshirt>

Massgeschneiderte T-Shirts auf Basis von Koerpermassen und Fit-Praeferenz.

- **Frontend:** React + Vite + Tailwind CSS (mobile-first, Deutsch, Lazy-Routing)
- **Backend:** Vercel Serverless Functions (lokal: Express)
- **Datenbank:** Turso (libsql/SQLite cloud, kostenloses Free-Tier)
- **E-Mails:** Resend (kostenloses Free-Tier — 100/Tag)
- **Algorithmus:** Gewichtete Distanz-Score-Matching + echtes Made-to-Measure

---

## Was kann die App?

- **Smart Match (65 €):** Algorithmus waehlt aus 80 Schnittmustern den am besten passenden — 3-Phasen-Score mit Gewichtung auf Brust/Schulter/Oberarm.
- **Made-to-Measure (129 €):** Jedes Mass wird direkt aus den Kundenmassen + Fit-Ease berechnet — keine Pattern-Auswahl, sondern wirklich individuelle Anfertigung.
- **Wizard:** 3 Schritte (Masse → Fit → Bestellung). Eingaben werden in `sessionStorage` gehalten, ueberleben einen Tab-Reload.
- **Admin:** Filter (Status × Produktionstyp), CSV-Export, Statuswechsel per Klick.
- **Recht:** Impressum / Datenschutz / AGB / Widerruf — Daten zentral in `src/lib/company.js`.

---

## Lokales Setup

```bash
npm install                       # Abhaengigkeiten
cp .env.example .env              # Werte sind lokal optional
npm run dev                       # Frontend (5173) + API (3001) parallel
```

Browser: <http://localhost:5173>

Ohne `TURSO_DATABASE_URL` in `.env` wird automatisch eine lokale Datei `local.db` verwendet.

---

## Projektstruktur

```
/api               Vercel Serverless Functions (Production)
/lib               Shared Backend
  matcher.js       Smart-Match-Algorithmus + computeMtm()
  db.js            Turso/SQLite + Schema-Migration
  handlers.js      Endpoint-Logik (gemeinsam mit dev-server)
  email.js         Resend-Versand (Bestaetigung + Admin)
  rate-limit.js    Einfaches in-memory rate limiting
  auth.js          Admin-Passwort (constant-time vergleich)
/data              patterns.json (80 Schnitte)
/src               React-Frontend
  /pages           Home, Configurator, OrderConfirmation, Admin, Rechtsseiten
  /components      WizardSteps, MeasurementInput, FitSilhouette, ConsentBanner
  /lib             api.js (fetch-Wrapper), company.js (Impressums-Daten)
dev-server.js      Lokaler Express-Server fuer /api/* in der Entwicklung
vercel.json        Vercel-Build- und Routing-Konfiguration
public/            robots.txt, sitemap.xml, og-image.svg, favicon
scripts/           Hilfs-Skripte (siehe scripts/push.ps1)
```

---

## API-Endpoints

| Methode | Pfad                    | Beschreibung                           | Rate-Limit |
|---------|-------------------------|----------------------------------------|------------|
| POST    | `/api/match`            | Matching + MTM-Spec                    | 30/min/IP  |
| POST    | `/api/order`            | Bestellung anlegen (loest E-Mails aus) | 5/min/IP   |
| GET     | `/api/orders/:id`       | Bestellung abrufen                     | —          |
| PATCH   | `/api/orders/:id`       | Status aendern (Admin)                 | —          |
| GET     | `/api/orders`           | Alle Bestellungen (Admin)              | —          |
| GET     | `/api/orders-export`    | CSV-Export (Admin)                     | —          |
| GET     | `/api/patterns`         | Alle Schnitte                          | —          |
| GET     | `/api/inventory`        | Lagerbestand pro Schnitt (Admin)       | —          |

Admin-Endpoints erwarten den Header `x-admin-password: <ADMIN_PASSWORD>`.

---

## Deployment-Setup (Vercel + Turso + Resend, 100% kostenlos)

### 1. Turso-Datenbank

Bereits eingerichtet. Falls neu:

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create fitshirt
turso db show fitshirt --url
turso db tokens create fitshirt
```

### 2. Resend-Account (fuer Bestellbestaetigungs-Mails)

1. <https://resend.com/signup> — kostenloses Konto (kein Kreditkarten-Eintrag).
2. **API Keys** → "Create API Key" → kopieren.
3. Optional: eine eigene Domain hinzufuegen und verifizieren. Ohne Domain
   ist der Absender `onboarding@resend.dev` — fuer den Anfang voellig OK.

### 3. Vercel Environment Variables

Vercel Dashboard → Project Settings → Environment Variables:

| Name | Wert | Pflicht? |
|------|------|----------|
| `TURSO_DATABASE_URL` | `libsql://...` | Ja (sonst geht DB beim Cold-Start verloren) |
| `TURSO_AUTH_TOKEN` | `...` | Ja |
| `ADMIN_PASSWORD` | dein-langes-passwort | Empfohlen |
| `RESEND_API_KEY` | `re_...` | Nein (skip = keine Mails) |
| `RESEND_FROM` | `FitShirt <hi@deine-domain.de>` | Nein (default: onboarding@resend.dev) |
| `ADMIN_EMAIL` | deine@mail.de | Empfohlen (interne Benachrichtigung) |
| `PUBLIC_URL` | `https://fitshirt-roan.vercel.app` | Nein |

Nach dem Setzen einmal **Redeploy** triggern (Vercel uebernimmt die Vars erst ab Deploy).

### 4. Impressum + Rechtsseiten ausfuellen

`src/lib/company.js` enthaelt alle Pflichtangaben fuer Impressum & Co. an
einer Stelle. Solange dort `TODO_...` Werte stehen, zeigt jede Rechtsseite
oben einen Warnbanner.

Pflichtfelder:

- `name` — voller Name oder Firmenname
- `street`, `cityZip` — ladungsfaehige Adresse (kein Postfach)
- `email`, `phone` — Kontakt
- `vatId` — USt-IdNr. oder leer (dann §19 UStG-Hinweis)

---

## Sicherheit & Robustheit

- **Rate-Limiting** auf POST-Endpoints (in-memory pro Funktions-Instanz).
- **Honeypot-Feld** auf dem Bestellformular gegen Bots.
- **Server-side Validation** von E-Mail-Format, Pflichtfeldern, Stringlaengen.
- **Constant-time Compare** beim Admin-Passwort.
- **CSP/SEO:** robots.txt, sitemap.xml, Open Graph, canonical URL.

---

## Aenderungen pushen

Wenn du im Cowork mode etwas geaendert hast und es live haben willst:

```powershell
.\scripts\push.ps1
```

Das Skript loescht ggf. eine stehengebliebene `.git/index.lock`, committet
alles und pusht auf `main`. Vercel deployed automatisch in 1-2 Minuten.
