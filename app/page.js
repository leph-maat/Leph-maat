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
            <a href="#" className="hover:text-[#D4
