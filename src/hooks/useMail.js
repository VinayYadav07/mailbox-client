import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const useMail = () => {
  const sendMail = async ({ from, to, subject, body }) => {
    if (!from || !to || !subject || !body) {
      throw new Error("All fields are required");
    }

    await addDoc(collection(db, "mails"), {
      from,
      to,
      subject,
      body,
      receiverRead: false,
      senderRead: false,
      createdAt: Date.now(),
    });
  };

  const getInboxMails = async (email) => {
    const q = query(collection(db, "mails"), where("to", "==", email));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  };

  const getSentMails = async (email) => {
    const q = query(collection(db, "mails"), where("from", "==", email));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  };

  const markAsRead = async (mailId, type) => {
    const mailRef = doc(db, "mails", mailId);
    if (type === "inbox") {
      await updateDoc(mailRef, { receiverRead: true });
    } else if (type === "sent") {
      await updateDoc(mailRef, { senderRead: true });
    }
  };

  const deleteMail = async (mailId) => {
    await deleteDoc(doc(db, "mails", mailId));
  };

  return {
    sendMail,
    getInboxMails,
    getSentMails,
    markAsRead,
    deleteMail,
  };
};
