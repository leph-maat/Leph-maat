'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const [buscado, setBuscado] = useState(false);

  async function buscar(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setCargando(true);
    setError(null);
    setBuscado(true);

    const { data, error: errorConsulta } = await supabase.rpc('consultar_reporte', {
      identificador: query.trim(),
    });

    setCargando(false);

    if (errorConsulta) {
      setError('Error al realizar la consulta. Intentá nuevamente.');
      setResultados(null);
      return;
    }

    setResultados(data || []);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-[#D4AF37]/20 bg-black/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⟁</span>
            <h1 className="text-2xl font-bold tracking-wider text-[#D4AF37]">LEPH</h1>
          </div>
          <div className="flex gap-8 text-sm uppercase tracking-widest">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Consultar</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Reportar Estafa</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Sobre Leph</a>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Hero */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-[#1F1F1F] border border-[#D4AF37]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#00E5FF] text-sm tracking-widest">JUSTICIA DIGITAL</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 gold-glow">LEPH MAAT</h1>
            <p className="text-xl text-[#C0C0C0] max-w-2xl mx-auto">
              Red de Reputación Descentralizada<br />
              <span className="text-[#9F4BFF]">Protege tu negocio. Expón a los estafadores.</span>
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={buscar} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Teléfono, @usuario, email o alias..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-2xl px-8 py-5 text-lg placeholder:text-gray-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F0C14D] hover:from-[#F0C14D] hover:to-[#D4AF37] text-black font-bold py-5 rounded-2xl text-lg transition-all disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {cargando ? 'BUSCANDO EN LA RED...' : 'CONSULTAR REPUTACIÓN'}
              </button>
            </form>
            <p className="text-xs text-[#777] mt-4">
              Tu búsqueda se hace mediante hash criptográfico • Nunca almacenamos tus datos
            </p>
          </div>

          {/* Results */}
          {error && (
            <div className="bg-red-950/50 border border-red-500/30 p-6 rounded-2xl text-red-400 max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {buscado && !cargando && resultados && resultados.length === 0 && (
            <div className="bg-green-950/30 border border-green-500/30 p-10 rounded-3xl max-w-2xl mx-auto text-center">
              <p className="text-4xl mb-4">✅</p>
              <p className="text-2xl text-green-400 font-semibold">SIN REPORTES</p>
              <p className="text-[#AAA] mt-3">No hay denuncias registradas para este identificador.</p>
            </div>
          )}

          {resultados && resultados.map((r, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#9F4BFF]/30 rounded-3xl p-8 max-w-2xl mx-auto mb-6">
              {/* Estado */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="uppercase tracking-widest text-sm text-red-400">VERIFICADO</span>
              </div>

              <div className="text-left space-y-4">
                <p><strong>Tipo:</strong> {r.tipo_fraude}</p>
                {r.descargo_texto && (
                  <div className="border-l-4 border-[#D4AF37] pl-4 italic text-gray-300">
                    "{r.descargo_texto}"
                  </div>
                )}
                <p className="text-sm text-gray-400">
                  Reportado el {new Date(r.creado_el).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-gray-500">
        © 2026 Leph Maat • Red de Reputación Descentralizada
      </footer>
    </main>
  );
}
