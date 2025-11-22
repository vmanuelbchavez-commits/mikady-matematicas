import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Clases.css'

function ClasesColegio({ user }) {
  const navigate = useNavigate()
  const [clases, setClases] = useState([])
  const [grado, setGrado] = useState('1')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarClases()
  }, [grado])

  const cargarClases = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clases_colegio')
      .select('*')
      .eq('grado', grado)
      .order('created_at', { ascending: false })

    if (!error) setClases(data || [])
    setLoading(false)
  }

  return (
    <div className="clases-page">
      <header className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">← Volver</button>
        <h1>🏫 Clases del Colegio</h1>
      </header>

      <div className="container">
        <div className="grado-selector">
          <button className={grado === '1' ? 'active' : ''} onClick={() => setGrado('1')}>1º Primaria</button>
          <button className={grado === '2' ? 'active' : ''} onClick={() => setGrado('2')}>2º Primaria</button>
          <button className={grado === '3' ? 'active' : ''} onClick={() => setGrado('3')}>3º Primaria</button>
        </div>

        {loading ? (
          <p className="loading">Cargando clases...</p>
        ) : clases.length === 0 ? (
          <p className="no-content">No hay clases disponibles para este grado</p>
        ) : (
          <div className="clases-list">
            {clases.map((clase) => (
              <div key={clase.id} className="clase-card">
                <h3>{clase.titulo}</h3>
                <p>{clase.descripcion}</p>
                {clase.archivo_url && (
                  <a href={clase.archivo_url} target="_blank" rel="noopener noreferrer" className="download-btn">
                    📥 Descargar Material
                  </a>
                )}
                <span className="fecha">{new Date(clase.created_at).toLocaleDateString('es-PE')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClasesColegio
