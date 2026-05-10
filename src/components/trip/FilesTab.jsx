import { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, orderBy, query, doc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { Upload, FileText, Trash2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import EmptyState from '../ui/EmptyState'

export default function FilesTab({ tripId, canEdit }) {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const q = query(collection(db, 'trips', tripId, 'files'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (s) => setFiles(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [tripId])

  const upload = async (file) => {
    if (!file) return
    const path = `trips/${tripId}/${Date.now()}_${file.name}`
    const r = ref(storage, path)
    const task = uploadBytesResumable(r, file)
    task.on('state_changed',
      (s) => setProgress((s.bytesTransferred / s.totalBytes) * 100),
      (err) => toast.error(err.message),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        await addDoc(collection(db, 'trips', tripId, 'files'), {
          name: file.name, url, size: file.size, path,
          uploadedBy: user.uid, createdAt: serverTimestamp(),
        })
        setProgress(0); toast.success('Uploaded')
      })
  }

  const onDrop = (e) => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach(upload) }
  const remove = async (f) => {
    try { await deleteObject(ref(storage, f.path)) } catch {}
    await deleteDoc(doc(db, 'trips', tripId, 'files', f.id))
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold">Files</h2>
      </div>

      {canEdit && (
        <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
          className="card p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center">
          <Upload className="w-8 h-8 mx-auto text-slate-400" />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Drag & drop files, or
            <label className="text-brand-600 cursor-pointer ml-1">
              browse
              <input type="file" className="hidden" multiple onChange={(e) => Array.from(e.target.files).forEach(upload)} />
            </label>
          </p>
          {progress > 0 && <div className="h-1.5 bg-slate-200 rounded mt-3 overflow-hidden"><div className="h-full bg-brand-500" style={{ width: `${progress}%` }} /></div>}
        </div>
      )}

      {files.length === 0 ? (
        <EmptyState icon={FileText} title="No files yet" description="Upload tickets, PDFs, and images for the team." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((f) => (
            <div key={f.id} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate text-sm">{f.name}</div>
                <div className="text-xs text-slate-400">{(f.size/1024).toFixed(0)} KB</div>
              </div>
              <a href={f.url} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:text-brand-600"><Download className="w-4 h-4" /></a>
              {canEdit && <button onClick={() => remove(f)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
