
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import fb  from './firebaseConfig';

export const getDocuments = async (collectionName: string) => {
  const colRef = collection(fb.firestore, collectionName);
  const colSnapshot = await getDocs(colRef);
  const documents = colSnapshot.docs.map(doc => ({
    id: doc.id,
    data: doc.data()
  }));
  return documents;
};

export const getDocument = async (collectionName: string, documentId: string) => {
  const docRef = doc(fb.firestore, collectionName, documentId);
  const docSnapshot = await getDoc(docRef);
  return { id: docSnapshot.id, data: docSnapshot.data() };
};

export const addDocument = async (collectionName: string, data: any) => {
  const newDocRef = doc(collection(fb.firestore, collectionName));
  await setDoc(newDocRef, data);
};