import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import './Dashboard.css'

function Dashboard({ user }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎓 Plataforma de Matemáticas</h1>
        <div className="user-info">
          <span>Hola, {user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Salir</button>
        </div>
      </header>

      <div className="container">
        <div className="cards-grid">
          <div className="card" onClick={() => navigate('/clases-colegio')}>
            <div className="card-icon">🏫</div>
            <h2>Clases del Colegio</h2>
            <p>Materiales para 1º, 2º y 3º de primaria</p>
          </div>

          <div className="card" onClick={() => navigate('/clases-particulares')}>
            <div className="card-icon">👨‍🏫</div>
            <h2>Clases Particulares</h2>
            <p>Asesorías personalizadas y clases en vivo</p>
          </div>

          <div className="card" onClick={() => navigate('/ejercicios')}>
            <div className="card-icon">📝</div>
            <h2>Ejercicios Prácticos</h2>
            <p>Practica y mejora tus habilidades</p>
          </div>

          <div className="card" onClick={() => navigate('/anotaciones')}>
            <div className="card-icon">📋</div>
            <h2>Mis Anotaciones</h2>
            <p>Notas y recordatorios importantes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
