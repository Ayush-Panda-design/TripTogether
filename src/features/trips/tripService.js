import {
  collection, query, where, onSnapshot, addDoc, doc, setDoc, updateDoc, deleteDoc,
  serverTimestamp, getDocs, getDoc, orderBy,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'

export const watchUserTrips = (uid, cb) => {
  const q = query(collection(db, 'trips'), where('memberIds', 'array-contains', uid))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
}

export const createTrip = async (user, data) => {
  const tripRef = await addDoc(collection(db, 'trips'), {
    ...data,
    ownerId: user.uid,
    memberIds: [user.uid],
    createdAt: serverTimestamp(),
    archived: false,
  })
  await setDoc(doc(db, 'trips', tripRef.id, 'members', user.uid), {
    role: 'owner', name: user.displayName || user.email, email: user.email,
    avatar: user.photoURL || '', joinedAt: serverTimestamp(),
  })
  return tripRef.id
}

export const watchTrip = (tripId, cb) =>
  onSnapshot(doc(db, 'trips', tripId), (d) => cb(d.exists() ? { id: d.id, ...d.data() } : null))

export const updateTrip = (tripId, data) => updateDoc(doc(db, 'trips', tripId), data)
export const deleteTrip = (tripId) => deleteDoc(doc(db, 'trips', tripId))

export const watchMembers = (tripId, cb) =>
  onSnapshot(collection(db, 'trips', tripId, 'members'), (snap) =>
    cb(snap.docs.map((d) => ({ uid: d.id, ...d.data() }))))

export const inviteMember = async (tripId, email, role = 'editor') => {
  // Look up user by email
  const usersSnap = await getDocs(query(collection(db, 'users'), where('email', '==', email)))
  if (usersSnap.empty) throw new Error('User with that email not found. Ask them to sign up first.')
  const u = usersSnap.docs[0]
  await setDoc(doc(db, 'trips', tripId, 'members', u.id), {
    role, name: u.data().name, email: u.data().email, avatar: u.data().avatar || '',
    joinedAt: serverTimestamp(),
  })
  // Update memberIds (denormalized for queries)
  const tripRef = doc(db, 'trips', tripId)
  const trip = await getDoc(tripRef)
  const ids = new Set(trip.data().memberIds || [])
  ids.add(u.id)
  await updateDoc(tripRef, { memberIds: Array.from(ids) })

  await addDoc(collection(db, 'notifications'), {
    userId: u.id, type: 'invite', tripId, read: false,
    createdAt: serverTimestamp(), payload: { tripTitle: trip.data().title },
  })
}

export const updateMemberRole = (tripId, uid, role) =>
  updateDoc(doc(db, 'trips', tripId, 'members', uid), { role })

export const removeMember = async (tripId, uid) => {
  await deleteDoc(doc(db, 'trips', tripId, 'members', uid))
  const tripRef = doc(db, 'trips', tripId)
  const trip = await getDoc(tripRef)
  await updateDoc(tripRef, { memberIds: (trip.data().memberIds || []).filter((x) => x !== uid) })
}
