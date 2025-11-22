import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './VerNotas.css'

function VerNotas() {
  const navigate = useNavigate()
  const [notasPorAlumno, setNotasPorAlumno] = useState([])
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarTodasLasNotas()
  }, [])

  const cargarTodasLasNotas = async () => {
    setLoading(true)
    
    try {
      const { data: alumnos, error: alumnosError } = await supabase
        .from('alumnos_info')
        .select('*')
        .order('nombre')

      if (alumnosError) {
        console.error('Error cargando alumnos:', alumnosError)
        setLoading(false)
        return
      }

      const { data: notas, error: notasError } = await supabase
        .from('notas_alumnos')
        .select('*')
        .order('created_at', { ascending: false })

      if (notasError) {
        console.error('Error cargando notas:', notasError)
      }

      console.log('Alumnos cargados:', alumnos?.length)
      console.log('Notas cargadas:', notas?.length)

      const agrupadas = alumnos?.map(alumno => {
        const notasAlumno = notas?.filter(nota => nota.user_id === alumno.user_id) || []
        console.log(`Alumno ${alumno.nombre}: ${notasAlumno.length} notas`)
        return {
          ...alumno,
          notas: notasAlumno
        }
      }) || []

      setNotasPorAlumno(agrupadas)
    } catch (error) {
      console.error('Error general:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcularPromedio = (notas) => {
    const notasConCalif = notas.filter(n => n.calificacion)
    if (notasConCalif.length === 0) return '-'
    const suma = notasConCalif.reduce((acc, n) => acc + parseFloat(n.calificacion), 0)
    return (suma / notasConCalif.length).toFixed(2)
  }

  const getTipoColor = (tipo) => {
    const colores = {
      excelente: '#27ae60',
      bueno: '#3498db',
      regular: '#f39c12',
      mejorar: '#e74c3c',
      info: '#9b59b6'
    }
    return colores[tipo] || '#999'
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => navigate('/admin')} className="back-btn">← Volver</button>
        <h1>📊 Historial de Notas</h1>
        <button onClick={cargarTodasLasNotas} className="btn-reload">🔄 Recargar</button>
      </header>

      <div className="container">
        <div className="ver-notas-content">
          {loading ? (
            <div className="loading-box">Cargando historial...</div>
          ) : notasPorAlumno.length === 0 ? (
            <div className="empty-box">
              <p>No hay alumnos registrados</p>
              <small>Si acabas de crear alumnos, recarga la página</small>
            </div>
          ) : (
            <>
              {/* Tabla resumen */}
              <div className="tabla-container">
                <h2>📋 Resumen General</h2>
                <table className="tabla-notas">
                  <thead>
                    <tr>
                      <th>Alumno</th>
                      <th>Grado</th>
                      <th>Total Notas</th>
                      <th>Promedio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notasPorAlumno.map((alumno) => (
                      <tr key={alumno.id}>
                        <td className="alumno-nombre">
                          <strong>{alumno.nombre}</strong>
                          <small>{alumno.email}</small>
                        </td>
                        <td className="text-center">{alumno.grado}º Primaria</td>
                        <td className="text-center">
                          <span className="badge-count">{alumno.notas.length}</span>
                        </td>
                        <td className="text-center">
                          <span className={`promedio-badge ${calcularPromedio(alumno.notas) >= 15 ? 'bueno' : calcularPromedio(alumno.notas) >= 11 ? 'regular' : 'bajo'}`}>
                            {calcularPromedio(alumno.notas)}
                          </span>
                        </td>
                        <td className="text-center">
                          <button 
                            onClick={() => setAlumnoSeleccionado(alumno)}
                            className="btn-ver-detalle"
                          >
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detalle del alumno seleccionado */}
              {alumnoSeleccionado && (
                <div className="detalle-alumno-modal">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h2>📝 Historial de {alumnoSeleccionado.nombre}</h2>
                      <button onClick={() => setAlumnoSeleccionado(null)} className="btn-cerrar">✕</button>
                    </div>
                    
                    <div className="alumno-info-detalle">
                      <div className="info-item">
                        <span className="label">Grado:</span>
                        <span className="value">{alumnoSeleccionado.grado}º Primaria</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Total Notas:</span>
                        <span className="value">{alumnoSeleccionado.notas.length}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Promedio:</span>
                        <span className="value">{calcularPromedio(alumnoSeleccionado.notas)}</span>
                      </div>
                    </div>

                    {alumnoSeleccionado.notas.length === 0 ? (
                      <p className="no-notas-detalle">Este alumno aún no tiene notas</p>
                    ) : (
                      <table className="tabla-detalle">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Calificación</th>
                            <th>Tipo</th>
                            <th>Comentario</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alumnoSeleccionado.notas.map((nota) => (
                            <tr key={nota.id}>
                              <td className="fecha-col">
                                {new Date(nota.created_at).toLocaleDateString('es-PE', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </td>
                              <td><strong>{nota.titulo}</strong></td>
                              <td>{nota.descripcion}</td>
                              <td className="text-center">
                                {nota.calificacion ? (
                                  <span className="calificacion-badge">{nota.calificacion}/20</span>
                                ) : '-'}
                              </td>
                              <td className="text-center">
                                <span 
                                  className="tipo-badge" 
                                  style={{backgroundColor: getTipoColor(nota.tipo)}}
                                >
                                  {nota.tipo}
                                </span>
                              </td>
                              <td className="comentario-col">{nota.comentario || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerNotas
