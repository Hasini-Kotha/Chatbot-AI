"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";

type Message = {
  id: string;
  role: string;
  text: string;
  timestamp?: any;
};

export default function ChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showHistory, setShowHistory] = useState(false); 

  const fetchMessages = async () => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const snapshot = await getDocs(q);
    const loadedMessages = snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Message, "id">) }))
      .filter((msg) => typeof msg.text === "string" && msg.text.trim() !== "");
    setMessages(loadedMessages);
  };

  const deleteAllMessages = async () => {
    const q = query(collection(db, "messages"));
    const snapshot = await getDocs(q);
    const batchDeletes = snapshot.docs.map((d) => deleteDoc(doc(db, "messages", d.id)));
    await Promise.all(batchDeletes);
    setMessages([]);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={() => setShowHistory((prev) => !prev)}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {showHistory ? "Hide Chat History " : "Show Chat History "}
      </button>

      {showHistory && (
        <>
          <div className="space-y-2">
            <h2 className="text-md font-semibold mb-2">Chat History</h2>
            {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md text-sm ${
                  msg.role === "user"
                    ? "bg-blue-100 text-black"
                    : "bg-green-100 text-black"
                }`}
              >
                <strong>{msg.role === "user" ? "You" : "Gemini"}:</strong> {msg.text}
              </div>
            ))}
          </div>

          <button
            onClick={deleteAllMessages}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete Chat History 
          </button>
        </>
      )}
    </div>
  );
}
