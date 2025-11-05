import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Marketplace from './pages/Marketplace.jsx'
import Requests from './pages/Requests.jsx'
import { useAuth } from './context/AuthContext.jsx'

function Nav() {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
        {/* Left: Logo */}
        <Link
  to="/"
  className="text-2xl font-bold tracking-tight hover:opacity-90 transition"
>
  <span className="text-white">Slot</span>
  <span className="text-blue-200">Swapper</span>
</Link>

        {/* Center: Navigation Links */}
        <div className="flex space-x-8 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-blue-200 transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/marketplace"
            className="hover:text-blue-200 transition duration-200"
          >
            Marketplace
          </Link>
          <Link
            to="/requests"
            className="hover:text-blue-200 transition duration-200"
          >
            Requests
          </Link>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-600 font-semibold px-4 py-1.5 rounded-md shadow-sm hover:bg-blue-100 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-800 text-white font-semibold px-4 py-1.5 rounded-md shadow-sm hover:bg-blue-900 transition duration-200"
              >
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="bg-blue-700 px-3 py-1 rounded-full font-medium text-white shadow-sm">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1.5 rounded-md shadow-sm transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className='pt-10'>
        <Routes>
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
          <Route path="/requests" element={<Protected><Requests /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  )
}
