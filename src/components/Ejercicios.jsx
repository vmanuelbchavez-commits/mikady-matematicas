import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Clases.css'

function Ejercicios({ user }) {
  const navigate = useNavigate()
  const [ejercicios, setEjercicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarEjercicios()
  }, [])

  const cargarEjercicios = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('ejercicios')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setEjercicios(data || [])
    setLoading(false)
  }

  return (
    <div className="clases-page">
      <header className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">← Volver</button>
        <h1>📝 Ejercicios Prácticos</h1>
      </header>

      <div className="container">
        {loading ? (
          <p className="loading">Cargando ejercicios...</p>
        ) : ejercicios.length === 0 ? (
          <p className="no-content">No hay ejercicios disponibles</p>
        ) : (
          <div className="clases-list">
            {ejercicios.map((ejercicio) => (
              <div key={ejercicio.id} className="clase-card">
                <h3>{ejercicio.titulo}</h3>
                <p>{ejercicio.descripcion}</p>
                <div className="ejercicio-info">
                  <span className="badge">Nivel: {ejercicio.nivel}</span>
                  <span className="badge">Tema: {ejercicio.tema}</span>
                </div>
                {ejercicio.archivo_url && (
                  <a href={ejercicio.archivo_url} target="_blank" rel="noopener noreferrer" className="download-btn">
                    📥 Descargar Ejercicio
                  </a>
                )}
                <span className="fecha">{new Date(ejercicio.created_at).toLocaleDateString('es-PE')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Ejercicios
