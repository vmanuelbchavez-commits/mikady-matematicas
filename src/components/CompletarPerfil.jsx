import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './CompletarPerfil.css'

function CompletarPerfil({ user, onComplete }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    grado: '1',
    nombre_padre: '',
    observaciones: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje(null)

    try {
      // Buscar si ya existe el registro
      const { data: existente } = await supabase
        .from('alumnos_info')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existente) {
        // Actualizar registro existente
        const { error } = await supabase
          .from('alumnos_info')
          .update({
            ...formData,
            datos_completos: true
          })
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Crear nuevo registro
        const { error } = await supabase
          .from('alumnos_info')
          .insert([{
            user_id: user.id,
            email: user.email,
            ...formData,
            datos_completos: true
          }])

        if (error) throw error
      }

      setMensaje({ tipo: 'success', texto: '¡Perfil completado! Redirigiendo...' })
      setTimeout(() => {
        onComplete()
      }, 1500)
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error: ' + error.message })
    }
    setLoading(false)
  }

  return (
    <div className="completar-perfil-page">
      <div className="completar-perfil-container">
        <div className="welcome-box">
          <h1>🌟 ¡Bienvenido a la Plataforma de Miss Mikady! 🌟</h1>
          <p>Para comenzar, necesitamos que completes tu información</p>
        </div>

        <div className="form-box">
          {mensaje && (
            <div className={mensaje.tipo === 'success' ? 'success-message' : 'error-message'}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>👤 Tu nombre completo *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: María López"
                required
              />
            </div>

            <div className="form-group">
              <label>🎂 Tu edad *</label>
              <input
                type="number"
                min="5"
                max="12"
                value={formData.edad}
                onChange={(e) => setFormData({...formData, edad: e.target.value})}
                placeholder="Ej: 7"
                required
              />
            </div>

            <div className="form-group">
              <label>📚 Tu grado *</label>
              <select
                value={formData.grado}
                onChange={(e) => setFormData({...formData, grado: e.target.value})}
                required
              >
                <option value="1">1º Primaria</option>
                <option value="2">2º Primaria</option>
                <option value="3">3º Primaria</option>
              </select>
            </div>

            <div className="form-group">
              <label>👨‍👩‍👦 Nombre de tu papá o mamá *</label>
              <input
                type="text"
                value={formData.nombre_padre}
                onChange={(e) => setFormData({...formData, nombre_padre: e.target.value})}
                placeholder="Ej: Juan López"
                required
              />
            </div>

            <div className="form-group">
              <label>📝 Observaciones (opcional)</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                placeholder="¿Hay algo que Miss Mikady deba saber? (alergias, necesidades especiales, etc.)"
                rows="4"
              />
              <small>Este mensaje lo leerá Miss Mikady</small>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '⏳ Guardando...' : '🚀 ¡Comenzar a Aprender!'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompletarPerfil
