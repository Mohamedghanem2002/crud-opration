import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";
import { setProjects } from "../redux/projectsSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function useFetchProjects() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsList = querySnapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || Date.now(),
            updated: data.updated?.toDate?.() || Date.now(),
          };
        });

        dispatch(setProjects({ projectsList, currentUserId: currentUser.uid }));
      } catch (err) {
        toast.error("Error fetching projects");
        console.error(err);
      }
    };

    fetchProjects();
  }, [dispatch]);
}
