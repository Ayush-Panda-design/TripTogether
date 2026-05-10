import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          await setDoc(ref, {
            name: u.displayName || u.email.split('@')[0],
            email: u.email,
            avatar: u.photoURL || '',
            createdAt: serverTimestamp(),
          })
        }
        const fresh = await getDoc(ref)
        setProfile({ uid: u.uid, ...fresh.data() })
      } else setProfile(null)
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'users', cred.user.uid), {
      name, email, avatar: '', createdAt: serverTimestamp(),
    })
    return cred.user
  }
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const loginGoogle = () => signInWithPopup(auth, googleProvider)
  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, profile, loading, signup, login, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
