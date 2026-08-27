// src/components/SentMail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const SentMail = () => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSentMails = async () => {
      try {
        const res = await axios.get("/api/mails/sent");
        setEmails(res.data);
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching emails");
        setIsLoading(false);
      }
    };
    fetchSentMails();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ul>
      {emails.map((email) => (
        <li key={email.id}>
          {email.subject} - {email.to}
        </li>
      ))}
    </ul>
  );
};

export default SentMail;
