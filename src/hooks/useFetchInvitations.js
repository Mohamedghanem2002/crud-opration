// src/hooks/useFetchInvitations.js
import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";
import { useDispatch } from "react-redux";
import { setInvitations } from "../Redux/projectsSlice";
import toast from "react-hot-toast";

export default function useFetchInvitations() {
  const dispatch = useDispatch();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "invitations"),
        where("inviteeEmail", "==", currentUser.email),
        where("inviteStatus", "==", "pending")
      );

      // subscribe للتغييرات
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const invs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch(setInvitations(invs));
        },
        (error) => {
          console.error(error);
          toast.error("Error listening to invitations");
        }
      );

      return () => unsubscribe(); // cleanup
    } catch (err) {
      console.error(err);
      toast.error("Error fetching invitations");
    }
  }, [dispatch]);
}
