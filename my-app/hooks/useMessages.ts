// hooks/useMessages.ts
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export function useMessages() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const q = query(collection(db, "messages"), orderBy("timestamp"));
      const snapshot = await getDocs(q);
      const loadedMessages = snapshot.docs.map((doc) => doc.data() as any);
      setMessages(loadedMessages);
    }

    fetchMessages();
  }, []);

  return messages;
}
