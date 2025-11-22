import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ClasesColegio from './components/ClasesColegio'
import ClasesParticulares from './components/ClasesParticulares'
import Ejercicios from './components/Ejercicios'
import Anotaciones from './components/Anotaciones'
import AdminDashboard from './components/Admin/AdminDashboard'
import GestionClasesColegio from './components/Admin/GestionClasesColegio'
import GestionClasesParticulares from './components/Admin/GestionClasesParticulares'
import GestionEjercicios from './components/Admin/GestionEjercicios'
import GestionUsuarios from './components/Admin/GestionUsuarios'
import GestionNotas from './components/Admin/GestionNotas'
import MisNotas from './components/MisNotas'
import CompletarPerfil from './components/CompletarPerfil'
import { supabase } from './supabaseClient'

// Email del administrador
const ADMIN_EMAIL = 'miss_mikady@mikady.com'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [perfilCompleto, setPerfilCompleto] = useState(false)
  const [checkingProfile, setCheckingProfile] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsAdmin(session?.user?.email === ADMIN_EMAIL)
      setLoading(false)
      if (session?.user) {
        verificarPerfil(session.user)
      } else {
        setCheckingProfile(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAdmin(session?.user?.email === ADMIN_EMAIL)
      if (session?.user) {
        verificarPerfil(session.user)
      } else {
        setCheckingProfile(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const verificarPerfil = async (currentUser) => {
    if (currentUser.email === ADMIN_EMAIL) {
      setPerfilCompleto(true)
      setCheckingProfile(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('alumnos_info')
        .select('datos_completos')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (error) {
        console.error('Error verificando perfil:', error)
        setPerfilCompleto(false)
      } else {
        setPerfilCompleto(data?.datos_completos || false)
      }
    } catch (err) {
      console.error('Error:', err)
      setPerfilCompleto(false)
    }
    setCheckingProfile(false)
  }

  const handlePerfilCompletado = () => {
    setPerfilCompleto(true)
  }

  if (loading || checkingProfile) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '24px'}}>
      ⏳ Cargando...
    </div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/clases-colegio" element={user ? <ClasesColegio user={user} /> : <Navigate to="/login" />} />
        <Route path="/clases-particulares" element={user ? <ClasesParticulares user={user} /> : <Navigate to="/login" />} />
        <Route path="/ejercicios" element={user ? <Ejercicios user={user} /> : <Navigate to="/login" />} />
        <Route path="/anotaciones" element={user ? <Anotaciones user={user} /> : <Navigate to="/login" />} />
        <Route path="/mis-notas" element={user ? <MisNotas user={user} /> : <Navigate to="/login" />} />
        <Route path="/completar-perfil" element={user && !isAdmin ? <CompletarPerfil user={user} onComplete={handlePerfilCompletado} /> : <Navigate to="/login" />} />
        
        {/* Rutas de administración */}
        <Route path="/admin" element={user && isAdmin ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin/clases-colegio" element={user && isAdmin ? <GestionClasesColegio /> : <Navigate to="/login" />} />
        <Route path="/admin/clases-particulares" element={user && isAdmin ? <GestionClasesParticulares /> : <Navigate to="/login" />} />
        <Route path="/admin/ejercicios" element={user && isAdmin ? <GestionEjercicios /> : <Navigate to="/login" />} />
        <Route path="/admin/usuarios" element={user && isAdmin ? <GestionUsuarios /> : <Navigate to="/login" />} />
        <Route path="/admin/notas" element={user && isAdmin ? <GestionNotas /> : <Navigate to="/login" />} />
        
        <Route path="/" element={<Navigate to={user ? (isAdmin ? "/admin" : (perfilCompleto ? "/dashboard" : "/completar-perfil")) : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
