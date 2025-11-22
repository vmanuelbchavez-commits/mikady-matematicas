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
    const { data } = await supabase.auth.admin.listUsers()
    setUsuarios(data?.users || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    const { data, error } = await supabase.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true,
      user_metadata: { nombre: formData.nombre }
    })

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al crear usuario: ' + error.message })
    } else {
      setMensaje({ tipo: 'success', texto: '¡Usuario creado exitosamente!' })
      setFormData({ email: '', password: '', nombre: '' })
      cargarUsuarios()
    }
    setLoading(false)
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
            <div className="usuarios-grid">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="item-card">
                  <h3>{usuario.user_metadata?.nombre || 'Sin nombre'}</h3>
                  <p>📧 {usuario.email}</p>
                  <p>📅 Creado: {new Date(usuario.created_at).toLocaleDateString('es-PE')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionUsuarios
