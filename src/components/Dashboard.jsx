import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Dashboard.css'

// Email del administrador
const ADMIN_EMAIL = 'miss_mikady@mikady.com'

function Dashboard({ user }) {
  const navigate = useNavigate()
  const isAdmin = user.email === ADMIN_EMAIL
  const [verificandoPerfil, setVerificandoPerfil] = useState(true)

  useEffect(() => {
    verificarPerfil()
  }, [])

  const verificarPerfil = async () => {
    if (isAdmin) {
      setVerificandoPerfil(false)
      return
    }

    const { data } = await supabase
      .from('alumnos_info')
      .select('datos_completos')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!data || !data.datos_completos) {
      navigate('/completar-perfil')
    } else {
      setVerificandoPerfil(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (verificandoPerfil) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '24px'}}>
      ⏳ Cargando...
    </div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌟 Plataforma de Miss Mikady 🌟</h1>
        <div className="user-info">
          <span className="welcome-text">¡Hola! 👋</span>
          <button onClick={handleLogout} className="logout-btn">👋 Salir</button>
        </div>
      </header>

      <div className="container">
        {isAdmin && (
          <div className="admin-banner">
            <button onClick={() => navigate('/admin')} className="admin-btn">
              👩‍🏫 Ir al Panel de Administración
            </button>
          </div>
        )}

        <div className="cards-grid">
          <div className="card card-1" onClick={() => navigate('/clases-colegio')}>
            <div className="card-icon">🏫</div>
            <h2>Clases del Colegio</h2>
            <p>📚 Aprende con tus compañeros</p>
          </div>

          <div className="card card-2" onClick={() => navigate('/clases-particulares')}>
            <div className="card-icon">👨‍🏫</div>
            <h2>Clases Particulares</h2>
            <p>🎥 Clases especiales en vivo</p>
          </div>

          <div className="card card-3" onClick={() => navigate('/ejercicios')}>
            <div className="card-icon">📝</div>
            <h2>Ejercicios Prácticos</h2>
            <p>🎯 Practica y diviértete</p>
          </div>

          <div className="card card-4" onClick={() => navigate('/mis-notas')}>
            <div className="card-icon">⭐</div>
            <h2>Mis Notas</h2>
            <p>📊 Mira tu progreso</p>
          </div>

          <div className="card card-5" onClick={() => navigate('/anotaciones')}>
            <div className="card-icon">📋</div>
            <h2>Mis Apuntes</h2>
            <p>✏️ Escribe tus ideas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
