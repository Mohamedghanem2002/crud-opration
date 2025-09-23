import { useEffect } from "react";
import { auth, db } from "./../../firebaseconfig";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function useProjectsCount() {
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(collection(db, "projects"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const userProjectsCount = snapshot.docs.filter((doc) =>
        doc.data().members?.some((m) => m.userId === currentUser.uid)
      ).length;

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { projectsCount: userProjectsCount });
    });

    return () => unsubscribe();
  }, []);
}
