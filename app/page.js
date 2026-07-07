'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  // Estado para formulario de reporte
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [formData, setFormData] = useState({
    identificador: '',
    tipo_fraude: '',
    monto: '',
    descripcion: '',
  });

  async function buscar(e) {
    e.preventDefault();
    if (!query.trim()) return;
    // ... (mantengo tu lógica de búsqueda)
    setCargando(true);
    const { data, error: errorConsulta } = await supabase.rpc('consultar_reporte', {
      identificador: query.trim(),
    });
    setCargando(false);
    if (errorConsulta) {
      setError('Error en la consulta');
    } else {
      setResultados(data || []);
    }
  }

  const handleReportChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviar
