import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Clases.css'

function ClasesParticulares({ user }) {
  const navigate = useNavigate()
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarClases()
  }, [])

  const cargarClases = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clases_particulares')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setClases(data || [])
    setLoading(false)
  }

  const handleVolver = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="clases-page">
      <header className="page-header">
        <button onClick={handleVolver} className="back-btn">← Volver</button>
        <h1>👨‍🏫 Clases Particulares</h1>
      </header>

      <div className="container">
        {loading ? (
          <p className="loading">Cargando clases...</p>
        ) : clases.length === 0 ? (
          <p className="no-content">No hay clases particulares disponibles</p>
        ) : (
          <div className="clases-list">
            {clases.map((clase) => (
              <div key={clase.id} className="clase-card">
                <h3>{clase.titulo}</h3>
                <p>{clase.descripcion}</p>
                {clase.link_clase && (
                  <a href={clase.link_clase} target="_blank" rel="noopener noreferrer" className="link-btn">
                    🎥 Unirse a la Clase
                  </a>
                )}
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

export default ClasesParticulares
