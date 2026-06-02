import { lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shirt, Loader2 } from 'lucide-react';
import Home from './pages/Home.jsx';
import ConsentBanner from './components/ConsentBanner.jsx';

// Lazy-load secondary routes so the initial bundle stays small.
// The home page is bundled eagerly because most first-time visits land there.
const Configurator = lazy(() => import('./pages/Configurator.jsx'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const Impressum = lazy(() => import('./pages/Impressum.jsx'));
const Datenschutz = lazy(() => import('./pages/Datenschutz.jsx'));
const AGB = lazy(() => import('./pages/AGB.jsx'));
const Widerruf = lazy(() => import('./pages/Widerruf.jsx'));

function RouteFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-24 flex items-center justify-center text-primary-400">
      <Loader2 size={28} className="animate-spin" />
    </div>
  );
}

function Header() {
  const { pathname } = useLocation();
  return (
    <header className="border-b border-primary-100 bg-cream/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="bg-primary text-cream p-2 rounded-md group-hover:bg-primary-500 transition-colors">
            <Shirt size={18} />
          </span>
          <span className="text-xl font-semibold tracking-tight text-primary">FitShirt</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className={`btn-ghost ${pathname === '/' ? 'bg-primary-100' : ''}`}>Start</Link>
          <Link to="/konfigurator" className={`btn-ghost ${pathname.startsWith('/konfigurator') ? 'bg-primary-100' : ''}`}>Konfigurator</Link>
          <Link to="/admin" className={`btn-ghost ${pathname.startsWith('/admin') ? 'bg-primary-100' : ''}`}>Admin</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-primary-100 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-primary-400 flex flex-col sm:flex-row sm:justify-between gap-4">
        <span>© {new Date().getFullYear()} FitShirt — Made-to-measure T-Shirts.</span>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link to="/impressum" className="hover:text-primary">Impressum</Link>
          <Link to="/datenschutz" className="hover:text-primary">Datenschutz</Link>
          <Link to="/agb" className="hover:text-primary">AGB</Link>
          <Link to="/widerruf" className="hover:text-primary">Widerruf</Link>
        </nav>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 animate-fade-in">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/konfigurator" element={<Configurator />} />
            <Route path="/bestellung/:id" element={<OrderConfirmation />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/widerruf" element={<Widerruf />} />
            <Route path="*" element={<div className="max-w-6xl mx-auto px-4 py-24 text-center"><h1 className="text-3xl">Seite nicht gefunden</h1></div>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
}
