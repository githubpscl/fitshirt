# FitShirt

**Live:** <https://fitshirt-roan.vercel.app>
**Admin:** <https://fitshirt-roan.vercel.app/admin> (Passwort: `admin123`)
**Repo:** <https://github.com/githubpscl/fitshirt>

Massgeschneiderte T-Shirts auf Basis von Koerpermassen und Fit-Praeferenz.

- **Frontend:** React + Vite + Tailwind CSS (mobile-first, Deutsch)
- **Backend:** Vercel Serverless Functions (lokal: Express)
- **Datenbank:** Turso (libsql/SQLite cloud, kostenloses Free-Tier)
- **Algorithmus:** Gewichtete Distanz-Score-Matching (siehe `lib/matcher.js`)

---

## Lokales Setup

```bash
# 1. Abhaengigkeiten installieren
npm install

# 2. .env anlegen (Werte sind fuer den lokalen File-DB-Modus optional)
cp .env.example .env

# 3. Start: Frontend (Port 5173) + API (Port 3001) parallel
npm run dev
```

Browser: <http://localhost:5173>
Admin-Dashboard: <http://localhost:5173/admin> (Passwort: `admin123`)

Ohne `TURSO_DATABASE_URL` in `.env` wird automatisch eine lokale Datei
`local.db` im Projektverzeichnis verwendet.

---

## Projektstruktur

```
/api               Vercel Serverless Functions (production)
/lib               Backend-Module (matcher, db, handlers, auth)
/data              Pattern-Datenbank (patterns.json, 80 Schnitte)
/src               React-Frontend
  /pages           Home, Configurator, OrderConfirmation, Admin
  /components      Wizard-Komponenten
  /lib             api.js (fetch-Wrapper) + Konstanten
dev-server.js      Lokaler Express-Server fuer /api/* in der Entwicklung
vercel.json        Vercel-Build- und Routing-Konfiguration
```

---

## API-Endpoints

| Methode | Pfad                    | Beschreibung                           |
|---------|-------------------------|----------------------------------------|
| POST    | `/api/match`            | Matching: Masse + Fit → Schnitt        |
| POST    | `/api/order`            | Bestellung anlegen                     |
| GET     | `/api/orders/:id`       | Bestellung abrufen                     |
| PATCH   | `/api/orders/:id`       | Status aendern (Admin)                 |
| GET     | `/api/orders`           | Alle Bestellungen (Admin)              |
| GET     | `/api/orders-export`    | CSV-Export (Admin)                     |
| GET     | `/api/patterns`         | Alle Schnitte                          |
| GET     | `/api/inventory`        | Lagerbestand pro Schnitt (Admin)       |

Admin-Endpoints erwarten den Header `x-admin-password: <ADMIN_PASSWORD>`.

---

## Deployment (Vercel + Turso, 100% kostenlos)

### 1. Turso-Datenbank anlegen

1. Account erstellen: <https://turso.tech> (GitHub-Login)
2. Im Dashboard "Create Database" → Name z.B. `fitshirt` → Region waehlen
3. "Connect" → kopiere **URL** und **Auth Token**

Oder mit CLI:

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create fitshirt
turso db show fitshirt --url
turso db tokens create fitshirt
```

### 2. GitHub-Repo

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create fitshirt --public --source=. --push
# oder manuell auf github.com erstellen und remote hinzufuegen
```

### 3. Vercel verbinden

1. <https://vercel.com> → "Add New Project" → GitHub-Repo `fitshirt` auswaehlen
2. Vercel erkennt Vite automatisch — Settings unveraendert lassen
3. **Environment Variables** hinzufuegen:
   - `TURSO_DATABASE_URL` = `libsql://...`
   - `TURSO_AUTH_TOKEN` = `...`
   - `ADMIN_PASSWORD` = `<eigenes-passwort>` (optional, default: `admin123`)
4. Deploy klicken — fertig.

Die URL ist `https://<projektname>.vercel.app`. Jeder neue Push auf `main`
deployed automatisch.

---

## Konfigurations-Hinweise

- **CORS:** Same-origin auf Vercel, lokal via Vite-Proxy → keine extra Konfiguration noetig.
- **Datenbank-Schema:** Wird beim ersten DB-Zugriff automatisch angelegt.
- **Patterns:** Werden beim API-Start aus `data/patterns.json` geladen.
- **Admin-Passwort:** Default `admin123` — fuer Produktion via `ADMIN_PASSWORD` setzen.
