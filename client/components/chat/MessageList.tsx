"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/types";

interface MessageListProps {
  messages: ChatMessage[];
  currentSessionId: string;
}

export function MessageList({ messages, currentSessionId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const isOwn = msg.session_id === currentSessionId;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
            >
              <span className="text-xs text-muted-foreground">
                {msg.display_name}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground/60">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
