import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './Admin.css'

function VerNotas() {
  const navigate = useNavigate()
  const [notasPorAlumno, setNotasPorAlumno] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarTodasLasNotas()
  }, [])

  const cargarTodasLasNotas = async () => {
    setLoading(true)
    
    // Cargar alumnos
    const { data: alumnos } = await supabase
      .from('alumnos_info')
      .select('*')
      .order('nombre')

    // Cargar notas
    const { data: notas } = await supabase
      .from('notas_alumnos')
      .select('*')
      .order('created_at', { ascending: false })

    // Agrupar notas por alumno
    const agrupadas = alumnos?.map(alumno => ({
      ...alumno,
      notas: notas?.filter(nota => nota.user_id === alumno.user_id) || []
    })) || []

    setNotasPorAlumno(agrupadas)
    setLoading(false)
  }

  const calcularPromedio = (notas) => {
    const notasConCalif = notas.filter(n => n.calificacion)
    if (notasConCalif.length === 0) return null
    const suma = notasConCalif.reduce((acc, n) => acc + parseFloat(n.calificacion), 0)
    return (suma / notasConCalif.length).toFixed(2)
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => navigate('/admin')} className="back-btn">← Volver</button>
        <h1>📊 Todas las Notas</h1>
      </header>

      <div className="container">
        <div className="admin-content">
          {loading ? (
            <p>Cargando notas...</p>
          ) : notasPorAlumno.length === 0 ? (
            <p>No hay alumnos registrados</p>
          ) : (
            notasPorAlumno.map((alumno) => (
              <div key={alumno.id} className="alumno-notas-section">
                <div className="alumno-notas-header">
                  <h2>👤 {alumno.nombre}</h2>
                  <div className="alumno-stats">
                    <span className="stat">📚 {alumno.grado}º Primaria</span>
                    <span className="stat">📝 {alumno.notas.length} notas</span>
                    {calcularPromedio(alumno.notas) && (
                      <span className="stat promedio">📊 Promedio: {calcularPromedio(alumno.notas)}</span>
                    )}
                  </div>
                </div>

                {alumno.notas.length === 0 ? (
                  <p className="no-notas-alumno">Este alumno aún no tiene notas</p>
                ) : (
                  <div className="notas-alumno-grid">
                    {alumno.notas.map((nota) => (
                      <div key={nota.id} className={`nota-mini nota-${nota.tipo}`}>
                        <h4>{nota.titulo}</h4>
                        {nota.calificacion && (
                          <div className="calificacion-mini">{nota.calificacion}/20</div>
                        )}
                        <p className="nota-desc-mini">{nota.descripcion}</p>
                        {nota.comentario && (
                          <p className="comentario-mini">💬 {nota.comentario}</p>
                        )}
                        <span className="fecha-mini">
                          {new Date(nota.created_at).toLocaleDateString('es-PE')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default VerNotas
