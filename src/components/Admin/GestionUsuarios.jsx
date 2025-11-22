import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './Admin.css'

function GestionUsuarios() {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: ''
  })

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    // Cargar alumnos desde tabla personalizada
    const { data } = await supabase
      .from('alumnos_info')
      .select('*')
      .order('created_at', { ascending: false })
    setUsuarios(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    try {
      // Crear usuario con signUp
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { nombre: formData.nombre }
        }
      })

      if (authError) throw authError

      // Guardar info adicional del alumno
      if (authData.user) {
        const { error: dbError } = await supabase
          .from('alumnos_info')
          .insert([{
            user_id: authData.user.id,
            nombre: formData.nombre,
            email: formData.email
          }])

        if (dbError) throw dbError
      }

      setMensaje({ 
        tipo: 'success', 
        texto: '¡Alumno creado exitosamente! Ya puede ingresar a la plataforma.' 
      })
      setFormData({ email: '', password: '', nombre: '' })
      cargarUsuarios()
    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error: ' + error.message + '. Por favor, crea el usuario manualmente en Supabase > Authentication > Users.' 
      })
    }
    setLoading(false)
  }

  const toggleAccesoParticulares = async (alumnoInfoId, accesoActual) => {
    const nuevoAcceso = !accesoActual
    const { error } = await supabase
      .from('alumnos_info')
      .update({ acceso_particulares: nuevoAcceso })
      .eq('id', alumnoInfoId)

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar acceso' })
    } else {
      setMensaje({ 
        tipo: 'success', 
        texto: nuevoAcceso ? 'Acceso a clases particulares activado' : 'Acceso a clases particulares desactivado'
      })
      cargarUsuarios()
    }
  }

  const eliminarAlumno = async (alumnoInfoId, userId) => {
    if (!confirm('¿Estás segura de eliminar este alumno? Se eliminarán sus datos y notas de la plataforma.')) {
      return
    }

    try {
      setLoading(true)
      
      // Eliminar las notas del alumno primero
      const { error: notasError } = await supabase
        .from('notas_alumnos')
        .delete()
        .eq('user_id', userId)

      if (notasError) {
        console.error('Error eliminando notas:', notasError)
      }

      // Eliminar de la tabla alumnos_info
      const { error: infoError } = await supabase
        .from('alumnos_info')
        .delete()
        .eq('id', alumnoInfoId)

      if (infoError) throw infoError

      setMensaje({ 
        tipo: 'success', 
        texto: 'Alumno eliminado de la plataforma. Para eliminarlo completamente de Supabase, ve a Authentication > Users y elimínalo manualmente.' 
      })
      
      setTimeout(() => {
        setMensaje(null)
        cargarUsuarios()
      }, 3000)
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar: ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => navigate('/admin')} className="back-btn">← Volver</button>
        <h1>👥 Gestionar Alumnos</h1>
      </header>

      <div className="container">
        <div className="admin-content">
          <h2>Crear Nuevo Alumno</h2>
          
          {mensaje && (
            <div className={mensaje.tipo === 'success' ? 'success-message' : 'error-message'}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del alumno *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="alumno@colegio.pe"
                required
              />
              <small>Puede ser un correo inventado, solo para identificar al alumno</small>
            </div>

            <div className="form-group">
              <label>Contraseña *</label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Contraseña simple que el alumno pueda recordar"
                required
              />
              <small>Usa algo simple como: alumno123, matematicas2024, etc.</small>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Alumno'}
            </button>
          </form>

          <div className="items-list">
            <h2>Alumnos Registrados ({usuarios.length})</h2>
            {usuarios.length === 0 ? (
              <p>No hay alumnos registrados todavía</p>
            ) : (
              <div className="alumnos-detalle-grid">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="alumno-detalle-card">
                    <div className="alumno-header">
                      <h3>👤 {usuario.nombre || 'Sin nombre'}</h3>
                      {!usuario.datos_completos && (
                        <span className="badge-pendiente">⚠️ Datos incompletos</span>
                      )}
                    </div>
                    
                    <div className="alumno-info-grid">
                      <div className="info-item">
                        <strong>📧 Email:</strong>
                        <span>{usuario.email}</span>
                      </div>
                      
                      {usuario.edad && (
                        <div className="info-item">
                          <strong>🎂 Edad:</strong>
                          <span>{usuario.edad} años</span>
                        </div>
                      )}
                      
                      {usuario.grado && (
                        <div className="info-item">
                          <strong>📚 Grado:</strong>
                          <span>{usuario.grado}º Primaria</span>
                        </div>
                      )}
                      
                      {usuario.nombre_padre && (
                        <div className="info-item">
                          <strong>👨‍👩‍👦 Padre/Madre:</strong>
                          <span>{usuario.nombre_padre}</span>
                        </div>
                      )}
                      
                      <div className="info-item">
                        <strong>📅 Registrado:</strong>
                        <span>{new Date(usuario.created_at).toLocaleDateString('es-PE')}</span>
                      </div>
                    </div>

                    {usuario.observaciones && (
                      <div className="observaciones-box">
                        <strong>📝 Observaciones:</strong>
                        <p>{usuario.observaciones}</p>
                      </div>
                    )}

                    <div className="item-actions">
                      <button 
                        onClick={() => toggleAccesoParticulares(usuario.id, usuario.acceso_particulares)} 
                        className={usuario.acceso_particulares ? "btn-success" : "btn-warning"}
                      >
                        {usuario.acceso_particulares ? '✅ Tiene acceso a particulares' : '🔒 Dar acceso a particulares'}
                      </button>
                      <button onClick={() => eliminarAlumno(usuario.id, usuario.user_id)} className="btn-danger">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionUsuarios
