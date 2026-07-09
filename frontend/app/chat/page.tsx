"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "../lib/api";
import { getUserId, getSessionId } from "../lib/user";
import { ChatMessage } from "../types";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = getUserId();
  const sessionId = getSessionId();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.sendChat({ user_id: userId, session_id: sessionId, message: input });
      const aiMessage: ChatMessage = { role: "assistant", content: response.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Sorry, I couldn't process that. Please try again!";
      const errorMessage: ChatMessage = { role: "assistant", content: detail };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      <div className="flex-1 overflow-y-auto px-4 py-8 max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <Send className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CareerPilot AI!</h2>
            <p className="text-gray-500 max-w-md">
              Ask me anything about careers, skills, projects, or interviews. I'm here to help!
            </p>
          </div>
          ) : (
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-6 py-5 ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-900 shadow-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap break-words">
                        {msg.content}
                    </p>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="bg-white border-t border-gray-200 px-4 py-6">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
