import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Anotaciones.css'

function Anotaciones({ user }) {
  const navigate = useNavigate()
  const [anotaciones, setAnotaciones] = useState([])
  const [nuevaNota, setNuevaNota] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarAnotaciones()
  }, [])

  const cargarAnotaciones = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('anotaciones')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setAnotaciones(data || [])
    setLoading(false)
  }

  const agregarAnotacion = async (e) => {
    e.preventDefault()
    if (!nuevaNota.trim()) return

    const { error } = await supabase
      .from('anotaciones')
      .insert([{ contenido: nuevaNota, user_id: user.id }])

    if (!error) {
      setNuevaNota('')
      cargarAnotaciones()
    }
  }

  const eliminarAnotacion = async (id) => {
    const { error } = await supabase
      .from('anotaciones')
      .delete()
      .eq('id', id)

    if (!error) cargarAnotaciones()
  }

  return (
    <div className="anotaciones-page">
      <header className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">← Volver</button>
        <h1>📋 Mis Anotaciones</h1>
      </header>

      <div className="container">
        <form onSubmit={agregarAnotacion} className="nota-form">
          <textarea
            placeholder="Escribe tu anotación aquí..."
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            rows="4"
          />
          <button type="submit">Agregar Anotación</button>
        </form>

        {loading ? (
          <p className="loading">Cargando anotaciones...</p>
        ) : anotaciones.length === 0 ? (
          <p className="no-content">No tienes anotaciones todavía</p>
        ) : (
          <div className="anotaciones-list">
            {anotaciones.map((nota) => (
              <div key={nota.id} className="nota-card">
                <p>{nota.contenido}</p>
                <div className="nota-footer">
                  <span className="fecha">{new Date(nota.created_at).toLocaleDateString('es-PE')}</span>
                  <button onClick={() => eliminarAnotacion(nota.id)} className="delete-btn">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Anotaciones
