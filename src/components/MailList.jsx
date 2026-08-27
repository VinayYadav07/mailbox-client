// src/components/MailList.jsx
import React, { useState, useEffect } from "react";

const MailList = () => {
  const [mails, setMails] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock Data Generate karne ka function
  const generateRandomMail = () => {
    const subjects = [
      "Project Update",
      "Meeting Reminder",
      "Invoice",
      "Greetings",
      "New Opportunity",
    ];
    const senders = [
      "alice@example.com",
      "bob@example.com",
      "carol@example.com",
    ];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomSender = senders[Math.floor(Math.random() * senders.length)];
    const currentTime = new Date().toISOString();

    return {
      id: Date.now(), // Unique ID
      subject: randomSubject,
      to: randomSender,
      isRead: false,
      createdAt: currentTime,
    };
  };

  useEffect(() => {
    // Initial data
    setMails([generateRandomMail()]);
    setUnreadCount(1);

    // Poll every 2 seconds (Naya mail aayega)
    const interval = setInterval(() => {
      const newMail = generateRandomMail();

      // Optimized update: Sirf naya mail add karo
      setMails((prevMails) => [...prevMails, newMail]);
      setUnreadCount((prevCount) => prevCount + 1);
    }, 2000);

    // Cleanup: Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Unread Mails: {unreadCount}</h3>
      <ul>
        {mails.map((mail) => (
          <li key={mail.id}>
            {mail.subject} - {mail.to}
            {mail.isRead ? <span> (Read)</span> : <span> (Unread)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MailList;
