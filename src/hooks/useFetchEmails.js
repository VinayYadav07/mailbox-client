// src/hooks/useFetchEmails.js
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export const useFetchEmails = (currentView) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setLoading(true);
      try {
        let q;
        if (currentView === "sent") {
          q = query(
            collection(db, "mails"),
            where("from", "==", user.email.toLowerCase()),
            orderBy("createdAt", "desc"),
          );
        } else {
          q = query(
            collection(db, "mails"),
            where("to", "==", user.email.toLowerCase()),
            orderBy("createdAt", "desc"),
          );
        }

        const querySnapshot = await getDocs(q);
        const emailList = [];
        querySnapshot.forEach((doc) => {
          emailList.push({ id: doc.id, ...doc.data() });
        });

        setEmails(emailList);
        setError(null);
      } catch (err) {
        setError("Failed to load emails");
        console.error("Error fetching emails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [currentView]);

  return { emails, loading, error };
};
