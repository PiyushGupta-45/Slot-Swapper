import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api.js'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await api('/api/auth/login', 'POST', { email, password })
      login(data.token, data.user)
      nav('/')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={submit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">
          Login
        </button>
        <p className="text-sm text-center">
          New here?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  )
}
