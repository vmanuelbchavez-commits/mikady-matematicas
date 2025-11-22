import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './MisNotas.css'

function MisNotas({ user }) {
  const navigate = useNavigate()
  const [notas, setNotas] = useState([])
  const [nombreAlumno, setNombreAlumno] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    
    // Cargar nombre del alumno
    const { data: alumnoData } = await supabase
      .from('alumnos_info')
      .select('nombre')
      .eq('user_id', user.id)
      .single()
    
    if (alumnoData) {
      setNombreAlumno(alumnoData.nombre)
    }

    // Cargar notas
    const { data, error } = await supabase
      .from('notas_alumnos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setNotas(data || [])
    setLoading(false)
  }

  const handleVolver = (e) => {
    e.preventDefault()
    window.location.href = '/dashboard'
  }

  return (
    <div className="mis-notas-page">
      <header className="page-header">
        <button onClick={handleVolver} className="back-btn">← Volver</button>
        <h1>⭐ Mis Notas y Progreso ⭐</h1>
      </header>

      <div className="container">
        <div className="welcome-banner">
          <h2>¡Hola{nombreAlumno ? `, ${nombreAlumno}` : ''}! 👋</h2>
          <p>Aquí puedes ver tus calificaciones y comentarios de Miss Mikady</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">⏳</div>
            <p>Cargando tus notas...</p>
          </div>
        ) : notas.length === 0 ? (
          <div className="no-notas">
            <div className="empty-icon">📝</div>
            <h3>Aún no tienes notas</h3>
            <p>Miss Mikady pronto agregará tus calificaciones aquí</p>
          </div>
        ) : (
          <div className="notas-grid">
            {notas.map((nota) => (
              <div key={nota.id} className={`nota-card nota-${nota.tipo || 'info'}`}>
                <div className="nota-header">
                  <h3>{nota.titulo}</h3>
                  {nota.calificacion && (
                    <div className="calificacion">
                      <span className="nota-numero">{nota.calificacion}</span>
                      <span className="nota-max">/20</span>
                    </div>
                  )}
                </div>
                
                <div className="nota-body">
                  <p className="nota-descripcion">{nota.descripcion}</p>
                  
                  {nota.comentario && (
                    <div className="comentario-box">
                      <strong>💬 Comentario de Miss Mikady:</strong>
                      <p>{nota.comentario}</p>
                    </div>
                  )}
                </div>

                <div className="nota-footer">
                  <span className="fecha">📅 {new Date(nota.created_at).toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MisNotas
