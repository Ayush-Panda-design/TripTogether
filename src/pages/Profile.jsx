import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import { updateProfile } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db, storage } from '../lib/firebase'
import toast from 'react-hot-toast'

export default function Profile() {
  const { profile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [uploading, setUploading] = useState(false)

  const onAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !auth.currentUser) return
    setUploading(true)
    try {
      const r = ref(storage, `avatars/${auth.currentUser.uid}/${file.name}`)
      await uploadBytes(r, file)
      const url = await getDownloadURL(r)
      await updateProfile(auth.currentUser, { photoURL: url })
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { avatar: url })
      toast.success('Avatar updated')
    } catch (err) { toast.error(err.message) }
    finally { setUploading(false) }
  }

  const save = async () => {
    if (!auth.currentUser) return
    await updateProfile(auth.currentUser, { displayName: name })
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { name })
    toast.success('Profile saved')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold mb-6">Profile</h1>
      <div className="card p-8 space-y-6">
        <div className="flex items-center gap-5">
          <Avatar src={profile?.avatar} name={profile?.name} size={80} />
          <label className="btn-outline cursor-pointer">
            {uploading ? 'Uploading…' : 'Change photo'}
            <input type="file" accept="image/*" onChange={onAvatar} className="hidden" />
          </label>
        </div>
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input bg-slate-50 dark:bg-slate-800" value={profile?.email || ''} disabled />
        </div>
        <button className="btn-primary" onClick={save}>Save changes</button>
      </div>
    </div>
  )
}
