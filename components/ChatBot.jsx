"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { useBookingModal } from "@/lib/bookingModalContext";

// Labels and prompts are localized in dict.chat.quickActions.<key>.
const QUICK_ACTIONS = [
  { key: "compare" },
  { key: "charging" },
  { key: "testDrive", modal: "test-drive" },
];

function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-teal text-obsidian"
            : "border border-silver/15 bg-ink/[0.04] text-ink"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default function ChatBot({ locale, dict }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const { openModal } = useBookingModal();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, locale }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? dict.noAnswer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: dict.error },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action.modal) {
      setOpen(false);
      openModal(action.modal);
      return;
    }
    sendMessage(dict.quickActions[action.key].prompt);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={dict.dialogLabel}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-teal/30 bg-page shadow-[0_0_60px_-15px_var(--color-teal)]"
          >
            <div className="flex items-center gap-3 border-b border-silver/10 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/10 text-accent">
                <Bot className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{dict.title}</p>
                <p className="text-xs text-muted">{dict.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={dict.close}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-silver/30 text-ink transition-colors hover:border-teal hover:text-accent"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <ChatBubble role="assistant" content={dict.greeting} />
              {messages.map((message, index) => (
                <ChatBubble key={index} role={message.role} content={message.content} />
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-silver/15 bg-ink/[0.04] px-4 py-2.5 text-sm text-muted">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    {dict.thinking}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-silver/10 px-4 py-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  className="rounded-full border border-silver/30 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-teal hover:text-accent"
                >
                  {dict.quickActions[action.key].label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-silver/10 p-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={dict.placeholder}
                className="flex-1 rounded-full border border-silver/20 bg-transparent px-4 py-2 text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={dict.send}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-obsidian transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? dict.close : dict.open}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-obsidian shadow-[0_0_30px_-8px_var(--color-teal)]"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
