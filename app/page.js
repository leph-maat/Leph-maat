'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [enviandoReporte, setEnviandoReporte] = useState(false);
  const [reporteOk, setReporteOk] = useState(false);
  const [formData, setFormData] = useState({
    identificador: '',
    tipo_fraude: '',
    monto: '',
    descripcion: '',
  });

  async function buscar(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setCargando(true);
    setError(null);
    const { data, error: errorConsulta } = await supabase.rpc('consultar_reporte', {
      identificador: query.trim(),
    });
    setCargando(false);
    if (errorConsulta) {
      setError('Error en la consulta. Intentá de nuevo.');
    } else {
      setResultados(data || []);
    }
  }

  const handleReportChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function enviarReporte(e) {
    e.preventDefault();
    if (!formData.identificador.trim() || !formData.tipo_fraude.trim()) return;
    setEnviandoReporte(true);
    setError(null);
    const { error: errorReporte } = await supabase.rpc('crear_reporte', {
      identificador: formData.identificador.trim(),
      tipo_fraude: formData.tipo_fraude,
      monto: formData.monto ? Number(formData.monto) : null,
      descripcion: formData.descripcion.trim(),
    });
    setEnviandoReporte(false);
    if (errorReporte) {
      setError('No se pudo enviar el reporte. Intentá de nuevo.');
    } else {
      setReporteOk(true);
      setFormData({ identificador: '', tipo_fraude: '', monto: '', descripcion: '' });
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-10 md:px-12 md:py-16">
      <div className="mx-auto max-w-3xl">

        <div className="mb-6 flex items-center gap-3">
          <span className="gold-text rune-pulse text-3xl leading-none">⟁</span>
          <span className="font-display chrome-text text-lg tracking-[0.3em]">LEPH</span>
        </div>

        <nav className="mb-14 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <a href="#consultar" className="text-[#B8BDC3] transition hover:text-[#00E5FF]">Consultar</a>
          <button
            onClick={() => setMostrarReporte(true)}
            className="text-[#B8BDC3] transition hover:text-[#9F4BFF]"
          >
            Reportar Estafa
          </button>
          <a href="#sobre" className="text-[#B8BDC3] transition hover:text-[#D4AF37]">Sobre Leph</a>
        </nav>

        <header className="mb-12 border-b border-white/10 pb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Justicia Digital
          </p>
          <h1 className="font-display chrome-text rune-glow text-5xl leading-none tracking-wide md:text-6xl">
            LEPH MAAT
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#C8CDD3]">
            Red de Reputación Descentralizada.
          </p>
          <p className="text-lg text-[#C8CDD3]">
            Protegé tu negocio. Expon a los estafadores.
          </p>
        </header>

        <section id="consultar" className="mb-16">
          <form onSubmit={buscar} className="glow-violet-electric flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Teléfono, @usuario, email o alias"
              className="border-glow flex-1 rounded-md border border-white/10 bg-black/40 px-4 py-3 text-[#F5F5F5] placeholder-[#6B6F75] outline-none"
            />
            <button
              type="submit"
              disabled={cargando}
              className="gold-text whitespace-nowrap rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-6 py-3 font-semibold tracking-wide transition hover:bg-[#D4AF37]/20 disabled:opacity-50"
            >
              {cargando ? 'Consultando...' : 'Consultar Reputación'}
            </button>
          </form>

          <p className="mt-4 text-sm text-[#6B6F75]">
            Tu búsqueda se hace mediante hash criptográfico · Nunca almacenamos tus datos originales.
          </p>

          {error && (
            <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {resultados && (
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-5">
              {resultados.length === 0 ? (
                <p className="text-[#C8CDD3]">
                  Sin reportes registrados para esta búsqueda.
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {resultados.map((r, i) => (
                    <li key={i} className="border-l-2 border-[#9F4BFF]/60 pl-4">
                      <p className="text-sm uppercase tracking-wide text-[#9F4BFF]">
                        {r.estado || 'pendiente'}
                      </p>
                      <p className="text-[#F5F5F5]">{r.tipo_fraude}</p>
                      {r.descripcion && (
                        <p className="mt-1 text-sm text-[#B8BDC3]">{r.descripcion}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {mostrarReporte && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="glow-violet-electric w-full max-w-md rounded-lg border border-white/10 bg-[#0F0F0F] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display chrome-text text-xl">Reportar Estafa</h2>
                <button
                  onClick={() => { setMostrarReporte(false); setReporteOk(false); }}
                  className="text-[#6B6F75] hover:text-[#F5F5F5]"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              {reporteOk ? (
                <p className="text-[#C8CDD3]">
                  Reporte enviado. Gracias por ayudar a proteger a la comunidad.
                </p>
              ) : (
                <form onSubmit={enviarReporte} className="flex flex-col gap-3">
                  <input
                    name="identificador"
                    value={formData.identificador}
                    onChange={handleReportChange}
                    placeholder="Teléfono, @usuario, email o alias"
                    required
                    className="border-glow rounded-md border border-white/10 bg-black/40 px-4 py-3 text-[#F5F5F5] placeholder-[#6B6F75] outline-none"
                  />
                  <input
                    name="tipo_fraude"
                    value={formData.tipo_fraude}
                    onChange={handleReportChange}
                    placeholder="Tipo de fraude"
                    required
                    className="border-glow rounded-md border border-white/10 bg-black/40 px-4 py-3 text-[#F5F5F5] placeholder-[#6B6F75] outline-none"
                  />
                  <input
                    name="monto"
                    value={formData.monto}
                    onChange={handleReportChange}
                    placeholder="Monto (opcional)"
                    type="number"
                    className="border-glow rounded-md border border-white/10 bg-black/40 px-4 py-3 text-[#F5F5F5] placeholder-[#6B6F75] outline-none"
                  />
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleReportChange}
                    placeholder="Descripción de lo ocurrido"
                    rows={4}
                    className="border-glow rounded-md border border-white/10 bg-black/40 px-4 py-3 text-[#F5F5F5] placeholder-[#6B6F75] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={enviandoReporte}
                    className="gold-text mt-2 rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-6 py-3 font-semibold tracking-wide transition hover:bg-[#D4AF37]/20 disabled:opacity-50"
                  >
                    {enviandoReporte ? 'Enviando...' : 'Enviar Reporte'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <footer id="sobre" className="mt-20 border-t border-white/10 pt-6 text-sm text-[#6B6F75]">
          <p>© 2026 Leph Maat · Red de Reputación Descentralizada</p>
        </footer>
      </div>
    </main>
  );
}
