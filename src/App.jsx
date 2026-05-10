import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AppShell from './components/layout/AppShell.jsx'
import LoadingScreen from './components/ui/LoadingScreen.jsx'

const Login = lazy(() => import('./pages/auth/Login.jsx'))
const Signup = lazy(() => import('./pages/auth/Signup.jsx'))
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard.jsx'))
const TripDetail = lazy(() => import('./pages/trip/TripDetail.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Landing = lazy(() => import('./pages/Landing.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trips/:tripId/*" element={<TripDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
