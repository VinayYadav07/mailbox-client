import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const Inbox = () => {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "mails"),
      where("to", "==", auth.currentUser.email),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mailList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMails(mailList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>📥 Inbox</h2>

      {mails.length === 0 ? (
        <p>No mails received.</p>
      ) : (
        mails.map((mail) => (
          <div key={mail.id}>
            <p>
              <strong>From:</strong> {mail.sender}
            </p>

            <p>
              <strong>Subject:</strong> {mail.subject}
            </p>

            <div
              dangerouslySetInnerHTML={{
                __html: mail.message,
              }}
            />

            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Inbox;
