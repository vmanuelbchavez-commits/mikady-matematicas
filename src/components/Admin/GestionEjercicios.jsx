import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './Admin.css'

function GestionEjercicios() {
  const navigate = useNavigate()
  const [ejercicios, setEjercicios] = useState([])
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [archivo, setArchivo] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    nivel: '1º Primaria',
    tema: ''
  })

  useEffect(() => {
    cargarEjercicios()
  }, [])

  const cargarEjercicios = async () => {
    const { data } = await supabase
      .from('ejercicios')
      .select('*')
      .order('created_at', { ascending: false })
    setEjercicios(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    let archivoUrl = null

    if (archivo) {
      const nombreArchivo = `${Date.now()}_${archivo.name}`
      const { error } = await supabase.storage
        .from('materiales')
        .upload(nombreArchivo, archivo)

      if (error) {
        setMensaje({ tipo: 'error', texto: 'Error al subir archivo' })
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('materiales')
        .getPublicUrl(nombreArchivo)
      
      archivoUrl = urlData.publicUrl
    }

    const { error } = await supabase
      .from('ejercicios')
      .insert([{ ...formData, archivo_url: archivoUrl }])

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al crear ejercicio' })
    } else {
      setMensaje({ tipo: 'success', texto: '¡Ejercicio creado exitosamente!' })
      setFormData({ titulo: '', descripcion: '', nivel: '1º Primaria', tema: '' })
      setArchivo(null)
      cargarEjercicios()
    }
    setLoading(false)
  }

  const eliminarEjercicio = async (id) => {
    if (confirm('¿Estás segura de eliminar este ejercicio?')) {
      await supabase.from('ejercicios').delete().eq('id', id)
      cargarEjercicios()
    }
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => navigate('/admin')} className="back-btn">← Volver</button>
        <h1>📝 Gestionar Ejercicios</h1>
      </header>

      <div className="container">
        <div className="admin-content">
          <h2>Agregar Nuevo Ejercicio</h2>
          
          {mensaje && (
            <div className={mensaje.tipo === 'success' ? 'success-message' : 'error-message'}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título del ejercicio *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Nivel *</label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData({...formData, nivel: e.target.value})}
              >
                <option value="1º Primaria">1º Primaria</option>
                <option value="2º Primaria">2º Primaria</option>
                <option value="3º Primaria">3º Primaria</option>
                <option value="Todos">Todos los niveles</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tema</label>
              <input
                type="text"
                value={formData.tema}
                onChange={(e) => setFormData({...formData, tema: e.target.value})}
                placeholder="Ej: Suma, Resta, Multiplicación..."
              />
            </div>

            <div className="form-group">
              <label>Archivo (PDF, imagen, etc.)</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="archivo"
                  onChange={(e) => setArchivo(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="archivo" className="upload-label">
                  📎 {archivo ? archivo.name : 'Haz clic para seleccionar archivo'}
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Ejercicio'}
            </button>
          </form>

          <div className="items-list">
            <h2>Ejercicios Existentes</h2>
            {ejercicios.map((ejercicio) => (
              <div key={ejercicio.id} className="item-card">
                <h3>{ejercicio.titulo}</h3>
                <p>{ejercicio.descripcion}</p>
                <p><strong>Nivel:</strong> {ejercicio.nivel}</p>
                <p><strong>Tema:</strong> {ejercicio.tema}</p>
                {ejercicio.archivo_url && <p>📎 Tiene archivo adjunto</p>}
                <div className="item-actions">
                  <button onClick={() => eliminarEjercicio(ejercicio.id)} className="btn-danger">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionEjercicios
