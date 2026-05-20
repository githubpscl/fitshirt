import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shirt } from 'lucide-react';
import Home from './pages/Home.jsx';
import Configurator from './pages/Configurator.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Admin from './pages/Admin.jsx';

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
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-primary-400 flex flex-col sm:flex-row sm:justify-between gap-2">
        <span>© {new Date().getFullYear()} FitShirt — Made-to-measure T-Shirts.</span>
        <span>Versand innerhalb von 10–14 Werktagen.</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 animate-fade-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/konfigurator" element={<Configurator />} />
          <Route path="/bestellung/:id" element={<OrderConfirmation />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<div className="max-w-6xl mx-auto px-4 py-24 text-center"><h1 className="text-3xl">Seite nicht gefunden</h1></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
