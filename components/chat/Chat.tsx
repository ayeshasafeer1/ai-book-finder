"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
const [isAtBottom, setIsAtBottom] = useState(true);
const {
    messages,
    sendMessage,
    stop,
    status,
    error,
  } = useChat();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
  if (!input.trim() || status !== "ready") return;

    await sendMessage({
      text: input,
    });

    setInput("");
  }
  function handleScroll() {
    const container = messagesContainerRef.current;
  
    if (!container) return;
  
    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;
  
    setIsAtBottom(distanceFromBottom < 50);
  }
  useEffect(() => {
    const container = messagesContainerRef.current;
  
    if (!container || !isAtBottom) return;
  
    container.scrollTop = container.scrollHeight;
  }, [messages, isAtBottom]);

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-3 py-4 sm:gap-4 sm:p-4">
          <div
  ref={messagesContainerRef}
  onScroll={handleScroll}
  className="flex h-[500px] flex-col gap-4 overflow-y-auto"
>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] break-words rounded-2xl px-3 py-2 text-sm sm:max-w-[85%] sm:px-4 sm:py-3 sm:text-base ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="mb-1 text-xs font-semibold opacity-70">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
      
                  <div className="whitespace-pre-wrap">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return <span key={index}>{part.text}</span>;
                      }
      
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {status === "submitted" && (
  <div className="flex items-center gap-2 text-sm text-gray-500">
    <span className="animate-pulse">●</span>
    <span>Thinking...</span>
  </div>
)}
{!isAtBottom && (
  <button
    type="button"
    onClick={() => {
      const container = messagesContainerRef.current;

      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });

      setIsAtBottom(true);
    }}
    className="self-center rounded-full border bg-white px-4 py-2 text-sm shadow"
  >
    ↓ Jump to latest
  </button>
)}
{error && (
  <div
    role="alert"
    className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
  >
    <span>Something went wrong. Please try again.</span>

    <button
      type="button"
      onClick={() => window.location.reload()}
      className="self-start rounded-lg border border-red-300 px-3 py-2 font-medium hover:bg-red-100 sm:self-auto"
    >
      Try again
    </button>
  </div>
)}
         <form onSubmit={handleSubmit} className="flex w-full gap-2">
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Tell me what you want to read..."
    disabled={status !== "ready"}
    className="min-w-0 flex-1 rounded-xl border px-3 py-3 text-sm sm:px-4 sm:text-base"
  />

  {status === "streaming" ? (
    <button
      type="button"
      onClick={() => stop()}
      className="shrink-0 rounded-xl bg-red-600 px-5 py-3 text-white"
    >
      Stop
    </button>
  ) : (
    <button
      type="submit"
      disabled={status !== "ready" || !input.trim()}
      className="shrink-0 rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
    >
      Send
    </button>
  )}
</form>
        </div>
      );
}