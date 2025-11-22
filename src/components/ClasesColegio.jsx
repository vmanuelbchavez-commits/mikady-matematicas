import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Clases.css'

function ClasesColegio({ user }) {
  const navigate = useNavigate()
  const [clases, setClases] = useState([])
  const [grado, setGrado] = useState('1')
  const [gradoAlumno, setGradoAlumno] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarGradoAlumno()
  }, [])

  useEffect(() => {
    if (gradoAlumno) {
      cargarClases()
    }
  }, [grado, gradoAlumno])

  const cargarGradoAlumno = async () => {
    const { data } = await supabase
      .from('alumnos_info')
      .select('grado')
      .eq('user_id', user.id)
      .single()
    
    if (data?.grado) {
      setGradoAlumno(data.grado)
      setGrado(data.grado)
    }
  }

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
        {gradoAlumno && (
          <div className="grado-info">
            <h2>📚 Clases de {gradoAlumno}º Primaria</h2>
            <p>Aquí están todas tus clases</p>
          </div>
        )}

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
