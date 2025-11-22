import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Usuario o contraseña incorrectos')
    }
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="welcome-header">
          <h1>🌟 ¡Bienvenidos! 🌟</h1>
          <h2>Plataforma de Miss Mikady</h2>
          <p className="subtitle">✨ Aprende matemáticas de forma divertida ✨</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="📧 Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="🔒 Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && <p className="error">{error}</p>}
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? '⏳ Ingresando...' : '🚀 ¡Entrar a Aprender!'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
