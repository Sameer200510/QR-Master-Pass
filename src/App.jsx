import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QrCode, ScanLine, Moon, Sun } from 'lucide-react';
import Generator from './pages/Generator';
import Scanner from './pages/Scanner';

function Navigation() {
  const location = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          width: 40, height: 40, 
          borderRadius: '0.75rem', 
          background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
        }}>
          <ScanLine size={20} />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
          MS <span style={{ color: 'var(--brand)' }}>Entry</span>
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="nav-links glass" style={{ padding: '0.25rem', borderRadius: '0.75rem' }}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <QrCode size={16} /> <span className="hide-mobile">Generate QR</span>
          </Link>
          <Link 
            to="/scanner" 
            className={`nav-link ${location.pathname === '/scanner' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ScanLine size={16} /> <span className="hide-mobile">Scanner</span>
          </Link>
        </div>
        
        <button 
          onClick={() => setDark(!dark)} 
          className="btn-secondary" 
          style={{ width: 40, height: 40, borderRadius: '0.75rem', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navigation />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Generator />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
