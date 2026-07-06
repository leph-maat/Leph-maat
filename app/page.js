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
      setError('No pudimos completar la consulta. Intentá de nuevo en un momento.');
      setResultados(null);
      return;
    }

    setResultados(data || []);
  }

  return (
    <main style={estilos.contenedor}>
      <div style={estilos.marca}>
        <span style={estilos.simbolo}>⟁</span>
        <h1 style={estilos.titulo}>Leph Maat</h1>
        <p style={estilos.subtitulo}>Red de reputación para revendedores · Consulta protegida por hash</p>
      </div>

      <form onSubmit={buscar} style={estilos.panelBusqueda}>
        <label style={estilos.label}>Consultar teléfono o alias</label>
        <div style={estilos.filaBusqueda}>
          <input
            type="text"
            placeholder="Ej: 11-2345-6789 o @usuario"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={estilos.input}
          />
          <button type="submit" style={estilos.boton} disabled={cargando}>
            {cargando ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        <p style={estilos.notaPrivacidad}>
          Tu búsqueda se compara mediante hash criptográfico. Leph Maat nunca almacena
          ni muestra el dato original de nadie — ni siquiera el tuyo.
        </p>
      </form>

      {error && <div style={estilos.tarjetaError}>{error}</div>}

      {buscado && !cargando && !error && resultados && resultados.length === 0 && (
        <div style={{ ...estilos.tarjeta, ...estilos.limpio }}>
          <div style={estilos.estadoLinea}>
            <span style={{ ...estilos.punto, background: '#6FBE84' }}></span>
            <span style={{ ...estilos.estadoNombre, color: '#9FD8AE' }}>SIN REPORTES</span>
          </div>
          <div style={estilos.detalle}>No encontramos denuncias asociadas a este contacto en la red.</div>
          <div style={estilos.meta}>Esto no garantiza que sea confiable — solo que nadie reportó todavía.</div>
        </div>
      )}

      {resultados && resultados.map((r, i) => {
        const config = {
          pendiente: { color: '#E0B45C', bg: 'rgba(166,124,46,0.08)', borde: 'rgba(166,124,46,0.4)', nombre: 'DENUNCIA PENDIENTE DE VERIFICACIÓN' },
          en_disputa: { color: '#C9AEE8', bg: 'rgba(91,42,134,0.15)', borde: 'rgba(91,42,134,0.5)', nombre: 'EN DISPUTA — HAY UN DESCARGO' },
          verificado: { color: '#E0A0A0', bg: 'rgba(156,61,61,0.1)', borde: 'rgba(156,61,61,0.45)', nombre: 'VERIFICADO — MÚLTIPLES DENUNCIAS' },
        }[r.estado] || { color: '#E0B45C', bg: 'rgba(166,124,46,0.08)', borde: 'rgba(166,124,46,0.4)', nombre: r.estado.toUpperCase() };

        return (
          <div key={i} style={{ ...estilos.tarjeta, background: config.bg, borderColor: config.borde }}>
            <div style={estilos.estadoLinea}>
              <span style={{ ...estilos.punto, background: config.color }}></span>
              <span style={{ ...estilos.estadoNombre, color: config.color }}>{config.nombre}</span>
            </div>
            <div style={estilos.detalle}>Tipo: {r.tipo_fraude}</div>
            {r.descargo_texto && (
              <div style={estilos.cajaDescargo}>&ldquo;{r.descargo_texto}&rdquo; — Respuesta del acusado</div>
            )}
            <div style={estilos.meta}>
              Reportado el {new Date(r.creado_el).toLocaleDateString('es-AR')}
            </div>
            <div style={estilos.contador}>
              {r.estado === 'verificado' ? '◉' : '◷'} {r.reportes_independientes} reporte{r.reportes_independientes !== 1 ? 's' : ''} independiente{r.reportes_independientes !== 1 ? 's' : ''}
            </div>
          </div>
        );
      })}

      <div style={estilos.divisor}></div>
      <p style={estilos.pie}>⟁ LepH — leph-maat.vercel.app</p>
    </main>
  );
}

const estilos = {
  contenedor: {
    background: 'linear-gradient(180deg, #2E1547 0%, #1D0E2E 100%)',
    minHeight: '100vh',
    padding: '48px 20px',
    fontFamily: "'Inter', sans-serif",
    color: '#FAF3E6',
  },
  marca: { textAlign: 'center', marginBottom: 40, maxWidth: 720, margin: '0 auto 40px' },
  simbolo: { fontSize: 32, color: '#E8C766', display: 'block', marginBottom: 6 },
  titulo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 600 },
  subtitulo: { fontSize: 13, color: '#C9B8DC', marginTop: 4 },
  panelBusqueda: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(232,199,102,0.25)',
    borderRadius: 14,
    padding: 28,
    marginBottom: 36,
    maxWidth: 720,
    margin: '0 auto 36px',
  },
  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#E8C766', display: 'block', marginBottom: 10 },
  filaBusqueda: { display: 'flex', gap: 10 },
  input: {
    flex: 1,
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: '14px 16px',
    color: '#FAF3E6',
    fontSize: 15,
  },
  boton: {
    background: 'linear-gradient(135deg, #E8C766, #C9A227)',
    color: '#2E1547',
    border: 'none',
    borderRadius: 8,
    padding: '0 26px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  notaPrivacidad: { fontSize: 11.5, color: '#9E8DB5', marginTop: 12, lineHeight: 1.5 },
  tarjeta: {
    maxWidth: 720,
    margin: '0 auto 16px',
    borderRadius: 12,
    padding: '20px 22px',
    border: '1px solid',
  },
  limpio: { background: 'rgba(74,124,89,0.08)', borderColor: 'rgba(74,124,89,0.4)' },
  tarjetaError: {
    maxWidth: 720,
    margin: '0 auto 16px',
    background: 'rgba(156,61,61,0.15)',
    border: '1px solid rgba(156,61,61,0.4)',
    borderRadius: 12,
    padding: '16px 20px',
    fontSize: 14,
  },
  estadoLinea: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  punto: { width: 9, height: 9, borderRadius: '50%', flexShrink: 0 },
  estadoNombre: { fontWeight: 700, fontSize: 14.5 },
  detalle: { fontSize: 13.5, color: '#D8CCE8', lineHeight: 1.6, marginLeft: 19 },
  meta: { fontSize: 11.5, color: '#8B7BA3', marginTop: 10, marginLeft: 19 },
  cajaDescargo: {
    marginTop: 14, marginLeft: 19, background: 'rgba(0,0,0,0.2)',
    borderLeft: '2px solid #C9A227', padding: '10px 14px', borderRadius: 4,
    fontSize: 13, color: '#CBBFE0', fontStyle: 'italic',
  },
  contador: {
    display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.25)',
    padding: '3px 10px', borderRadius: 20, fontSize: 11.5, color: '#E8C766',
    marginLeft: 19, marginTop: 8,
  },
  divisor: { height: 1, background: 'rgba(232,199,102,0.15)', margin: '40px auto', maxWidth: 720 },
  pie: { textAlign: 'center', fontSize: 11, color: '#6E5D85', letterSpacing: 0.5 },
};
