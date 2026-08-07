
import { db } from '../firebaseConfig';
import { doc, setDoc, onSnapshot, collection, addDoc, getDoc } from 'firebase/firestore';

// Free Google STUN servers - real call ke liye
export const servers = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
  ],
  iceCandidatePoolSize: 10,
};

export const createCall = async (callId, offer) => {
  const callDoc = doc(db, 'calls', callId);
  await setDoc(callDoc, { offer, createdAt: Date.now() });
  return callDoc;
};

export const listenForAnswer = (callId, callback) => {
  return onSnapshot(doc(db, 'calls', callId), (snap) => {
    const data = snap.data();
    if (data?.answer) callback(data.answer);
  });
};
