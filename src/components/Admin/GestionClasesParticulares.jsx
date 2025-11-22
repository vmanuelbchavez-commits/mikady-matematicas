import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './Admin.css'

function GestionClasesParticulares() {
  const navigate = useNavigate()
  const [clases, setClases] = useState([])
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [archivo, setArchivo] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    link_clase: ''
  })

  useEffect(() => {
    cargarClases()
  }, [])

  const cargarClases = async () => {
    const { data } = await supabase
      .from('clases_particulares')
      .select('*')
      .order('created_at', { ascending: false })
    setClases(data || [])
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
      .from('clases_particulares')
      .insert([{ ...formData, archivo_url: archivoUrl }])

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Error al crear clase' })
    } else {
      setMensaje({ tipo: 'success', texto: '¡Clase creada exitosamente!' })
      setFormData({ titulo: '', descripcion: '', link_clase: '' })
      setArchivo(null)
      cargarClases()
    }
    setLoading(false)
  }

  const eliminarClase = async (id) => {
    if (confirm('¿Estás segura de eliminar esta clase?')) {
      await supabase.from('clases_particulares').delete().eq('id', id)
      cargarClases()
    }
  }

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => navigate('/admin')} className="back-btn">← Volver</button>
        <h1>👨‍🏫 Gestionar Clases Particulares</h1>
      </header>

      <div className="container">
        <div className="admin-content">
          <h2>Agregar Nueva Clase Particular</h2>
          
          {mensaje && (
            <div className={mensaje.tipo === 'success' ? 'success-message' : 'error-message'}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título de la clase *</label>
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
              <label>Link de la clase (Zoom, Google Meet, etc.)</label>
              <input
                type="url"
                value={formData.link_clase}
                onChange={(e) => setFormData({...formData, link_clase: e.target.value})}
                placeholder="https://zoom.us/j/..."
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
              {loading ? 'Guardando...' : 'Guardar Clase'}
            </button>
          </form>

          <div className="items-list">
            <h2>Clases Existentes</h2>
            {clases.map((clase) => (
              <div key={clase.id} className="item-card">
                <h3>{clase.titulo}</h3>
                <p>{clase.descripcion}</p>
                {clase.link_clase && <p>🔗 <a href={clase.link_clase} target="_blank">Ver enlace</a></p>}
                {clase.archivo_url && <p>📎 Tiene archivo adjunto</p>}
                <div className="item-actions">
                  <button onClick={() => eliminarClase(clase.id)} className="btn-danger">
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

export default GestionClasesParticulares
