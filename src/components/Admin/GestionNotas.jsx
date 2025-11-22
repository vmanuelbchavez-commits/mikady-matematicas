import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './Admin.css'

function GestionNotas() {
  const navigate = useNavigate()
  const [alumnos, setAlumnos] = useState([])
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('')
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    calificacion: '',
    comentario: '',
    tipo: 'info'
  })

  useEffect(() => {
    cargarAlumnos()
  }, [])

  useEffect(() => {
    if (alumnoSeleccionado) {
      cargarNotasAlumno()
    }
  }, [alumnoSeleccionado])

  const cargarAlumnos = async () => {
    const { data } = await supabase
      .from('alumnos_info')
      .select('*')
      .order('nombre')
    setAlumnos(data || [])
  }

  const cargarNotasAlumno = async () => {
    const { data } = await supabase
      .from('notas_alumnos')
      .select('*')
      .eq('user_id', alumnoSeleccionado)
      .order('created_at', { ascending: false })
    setNotas(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!alumnoSeleccionado) {
      setMensaje({ tipo: 'error', texto: 'Selecciona un alumno' })
      return
    }

    setLoading(true)
    setMensaje(null)

    const { error } = await supabase
      .from('notas_alumnos')
      .insert([{ ...formData, user_id: alumnoSeleccionado }])

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al crear nota' })
    } else {
      setMensaje({ tipo: 'success', texto: '¡Nota agregada exitosamente!' })
      setFormData({ titulo: '', descripcion: '', calificacion: '', comentario: '', tipo: 'info' })
      cargarNotasAlumno()
    }
    setLoading(false)
  }

  const eliminarNota = async (id) => {
    if (confirm('¿Estás segura de eliminar esta nota?')) {
      await supabase.from('notas_alumnos').delete().eq('id', id)
      cargarNotasAlumno()
    }
  }

  const alumnoActual = alumnos.find(a => a.user_id === alumnoSeleccionado)

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => navigate('/admin')} className="back-btn">← Volver</button>
        <h1>⭐ Gestionar Notas de Alumnos</h1>
      </header>

      <div className="container">
        <div className="admin-content">
          <h2>Agregar Nota a un Alumno</h2>
          
          {mensaje && (
            <div className={mensaje.tipo === 'success' ? 'success-message' : 'error-message'}>
              {mensaje.texto}
            </div>
          )}

          <div className="form-group">
            <label>Seleccionar Alumno *</label>
            <select
              value={alumnoSeleccionado}
              onChange={(e) => setAlumnoSeleccionado(e.target.value)}
              required
            >
              <option value="">-- Selecciona un alumno --</option>
              {alumnos.map((alumno) => (
                <option key={alumno.user_id} value={alumno.user_id}>
                  {alumno.nombre} ({alumno.email})
                </option>
              ))}
            </select>
          </div>

          {alumnoSeleccionado && (
            <>
              <div className="alumno-info">
                <h3>📝 Agregar nota para: {alumnoActual?.nombre || alumnoActual?.email}</h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Título de la nota *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ej: Examen de Suma y Resta"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Describe la evaluación o actividad"
                  />
                </div>

                <div className="form-group">
                  <label>Calificación (sobre 20)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={formData.calificacion}
                    onChange={(e) => setFormData({...formData, calificacion: e.target.value})}
                    placeholder="Ej: 18"
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de nota</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  >
                    <option value="excelente">⭐ Excelente (18-20)</option>
                    <option value="bueno">👍 Bueno (15-17)</option>
                    <option value="regular">📝 Regular (11-14)</option>
                    <option value="mejorar">💪 Puede mejorar (0-10)</option>
                    <option value="info">ℹ️ Información general</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Comentario para el alumno y padres</label>
                  <textarea
                    value={formData.comentario}
                    onChange={(e) => setFormData({...formData, comentario: e.target.value})}
                    placeholder="Escribe un comentario motivador o sugerencias de mejora"
                    rows="4"
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Nota'}
                </button>
              </form>

              <div className="items-list">
                <h2>Notas de {alumnoActual?.nombre || alumnoActual?.email}</h2>
                {notas.length === 0 ? (
                  <p>Este alumno aún no tiene notas</p>
                ) : (
                  notas.map((nota) => (
                    <div key={nota.id} className="item-card">
                      <h3>{nota.titulo}</h3>
                      {nota.calificacion && <p><strong>Calificación:</strong> {nota.calificacion}/20</p>}
                      <p>{nota.descripcion}</p>
                      {nota.comentario && <p><strong>Comentario:</strong> {nota.comentario}</p>}
                      <p><strong>Tipo:</strong> {nota.tipo}</p>
                      <div className="item-actions">
                        <button onClick={() => eliminarNota(nota.id)} className="btn-danger">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default GestionNotas
