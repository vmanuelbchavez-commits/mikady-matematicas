import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ClasesColegio from './components/ClasesColegio'
import ClasesParticulares from './components/ClasesParticulares'
import Ejercicios from './components/Ejercicios'
import Anotaciones from './components/Anotaciones'
import { supabase } from './supabaseClient'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/clases-colegio" element={user ? <ClasesColegio user={user} /> : <Navigate to="/login" />} />
        <Route path="/clases-particulares" element={user ? <ClasesParticulares user={user} /> : <Navigate to="/login" />} />
        <Route path="/ejercicios" element={user ? <Ejercicios user={user} /> : <Navigate to="/login" />} />
        <Route path="/anotaciones" element={user ? <Anotaciones user={user} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
