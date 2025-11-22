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
import { supabase } from './supabaseClient'

// Email del administrador - CAMBIAR POR EL EMAIL DE LA PROFESORA
const ADMIN_EMAIL = 'profesora@mikady.com'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsAdmin(session?.user?.email === ADMIN_EMAIL)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAdmin(session?.user?.email === ADMIN_EMAIL)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white'}}>
      Cargando...
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
        
        {/* Rutas de administración */}
        <Route path="/admin" element={user && isAdmin ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin/clases-colegio" element={user && isAdmin ? <GestionClasesColegio /> : <Navigate to="/login" />} />
        <Route path="/admin/clases-particulares" element={user && isAdmin ? <GestionClasesParticulares /> : <Navigate to="/login" />} />
        <Route path="/admin/ejercicios" element={user && isAdmin ? <GestionEjercicios /> : <Navigate to="/login" />} />
        <Route path="/admin/usuarios" element={user && isAdmin ? <GestionUsuarios /> : <Navigate to="/login" />} />
        
        <Route path="/" element={<Navigate to={user ? (isAdmin ? "/admin" : "/dashboard") : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
