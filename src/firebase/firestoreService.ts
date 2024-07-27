
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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