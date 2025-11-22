import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import './Admin.css'

function AdminDashboard({ user }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>👩‍🏫 Panel de Administración - Mikady</h1>
        <div className="user-info">
          <span>Administrador: {user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Salir</button>
        </div>
      </header>

      <div className="container">
        <div className="admin-cards-grid">
          <div className="admin-card" onClick={() => navigate('/admin/clases-colegio')}>
            <div className="card-icon">🏫</div>
            <h2>Gestionar Clases del Colegio</h2>
            <p>Agregar, editar y eliminar clases por grado</p>
          </div>

          <div className="admin-card" onClick={() => navigate('/admin/clases-particulares')}>
            <div className="card-icon">👨‍🏫</div>
            <h2>Gestionar Clases Particulares</h2>
            <p>Administrar clases particulares y enlaces</p>
          </div>

          <div className="admin-card" onClick={() => navigate('/admin/ejercicios')}>
            <div className="card-icon">📝</div>
            <h2>Gestionar Ejercicios</h2>
            <p>Subir y administrar ejercicios prácticos</p>
          </div>

          <div className="admin-card" onClick={() => navigate('/admin/usuarios')}>
            <div className="card-icon">👥</div>
            <h2>Gestionar Alumnos</h2>
            <p>Crear y administrar usuarios de alumnos</p>
          </div>

          <div className="admin-card" onClick={() => navigate('/admin/notas')}>
            <div className="card-icon">⭐</div>
            <h2>Gestionar Notas</h2>
            <p>Agregar calificaciones y comentarios a alumnos</p>
          </div>

          <div className="admin-card" onClick={() => navigate('/admin/ver-notas')}>
            <div className="card-icon">📊</div>
            <h2>Ver Todas las Notas</h2>
            <p>Revisar todas las notas que has puesto</p>
          </div>

          <div className="admin-card" onClick={() => navigate('/dashboard')}>
            <div className="card-icon">👁️</div>
            <h2>Ver como Alumno</h2>
            <p>Ver la plataforma como la ven los alumnos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
