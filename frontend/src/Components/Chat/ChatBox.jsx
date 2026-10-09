import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { initials } from "../../Utils/helpers";
import axios from "axios";

/* Instagram-style DM: pill bubbles, grouped corners, avatar beside their last message */

const styles = `
@keyframes tf-pop{from{opacity:0;transform:translateY(12px) scale(.94)}to{opacity:1;transform:none}}
.tf-pop{animation:tf-pop .25s cubic-bezier(.2,.7,.2,1) both;transform-origin:bottom}
@media (prefers-reduced-motion:reduce){.tf-pop{animation:none}}
`;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]";

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const GAP_MS = 30 * 60 * 1000; // show a time label after 30 quiet minutes

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

// "Today 3:42 pm", "Yesterday 9:10 am" or "12 Mar 2026, 4:05 pm"
const stampLabel = (value) => {
  const d = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const time = formatTime(value);
  if (d.toDateString() === today.toDateString()) return `Today ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`;
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}, ${time}`;
};

// Local id so every message has a stable React key
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Messages only live in this component's state for now — there is no message API yet
const ChatBox = ({ contact, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  const { id } = useParams();
  const loggedInUser = useSelector((store) => store.user);
  const myId = loggedInUser?._id;

  useEffect(() => {
    axios.get(import.meta.env.VITE_BACKEND_URL + `/api/chats/${id}`, {
      withCredentials : true
    })
    .then((res) => {
      setMessages(res.data.data)
    })
  }, [])

  // One socket connection for the lifetime of the chat box, closed on unmount
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socketRef.current = socket;

    socket.emit("join-room", {
      sender : myId,
      receiver : id
    })

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Listen for incoming messages for the open conversation; reset when the contact changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    setMessages([]);

    const handleIncoming = (data) => {
      // Only keep messages sent by this contact to the logged-in user
      if (String(data.sender) !== String(id)) return;
      if (data.receiver && String(data.receiver) !== String(myId)) return;

      setMessages((prev) => [
        ...prev,
        {
          id: data._id ?? makeId(),
          text: data.msg,
          sender: data.sender,
          createdAt: data.createdAt ?? Date.now(),
        },
      ]);
    };

    socket.on("rec-msg", handleIncoming);
    return () => {
      socket.off("rec-msg", handleIncoming);
    };
  }, [id, myId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = text.trim();
    const socket = socketRef.current;
    if (!value || !socket || !myId) return;

    const createdAt = Date.now();

    socket.emit("send-msg", {
      msg: value,
      sender: myId,
      receiver: id,
      createdAt,
    });

    setMessages((prev) => [...prev, { id: makeId(), text: value, sender: myId, createdAt }]);
    setText("");
  };

  const avatarColor = avatarGradients[(contact?.name ?? "").length % avatarGradients.length];

  const Avatar = ({ size }) => (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${avatarColor}`}>
      {initials(contact?.name ?? "")}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-73px-3rem)] flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 lg:h-[calc(100vh-73px-4rem)]">
      <style>{styles}</style>

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-3 py-2.5 sm:px-4">
        <button
          type="button"
          onClick={onBack}
          className={`rounded-full p-2 text-[#0E1530] transition hover:bg-slate-100 ${focusRing}`}
          aria-label="Back to conversations"
        >
          <ArrowLeft size={22} />
        </button>

        <Avatar size="h-10 w-10 text-sm" />

        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-[#0E1530]">{contact?.name}</p>
          <p className="truncate text-xs capitalize text-slate-500">{contact?.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5" role="log" aria-live="polite" aria-label="Messages">
        {/* Profile intro, like the top of an Instagram chat */}
        <div className="flex flex-col items-center pb-6 pt-4 text-center">
          <Avatar size="h-20 w-20 text-2xl" />
          <p className="mt-3 text-base font-semibold text-[#0E1530]">{contact?.name}</p>
          <p className="text-sm text-slate-500">
            <span className="capitalize">{contact?.role}</span>
            {contact?.email && <> · {contact.email}</>}
          </p>
          {messages.length === 0 && (
            <p className="mt-6 text-sm text-slate-400">No messages yet. Say hello to {contact?.name ?? "them"}.</p>
          )}
        </div>

        <div>
          {messages.map((message, i) => {
            const prev = messages[i - 1];
            const next = messages[i + 1];
            const isMine = String(message.sender) === String(myId);

            const showStamp = !prev || new Date(message.createdAt) - new Date(prev.createdAt) > GAP_MS ||
              new Date(prev.createdAt).toDateString() !== new Date(message.createdAt).toDateString();

            const joinsPrev = prev && !showStamp && String(prev.sender) === String(message.sender);
            const nextStamp = next && (new Date(next.createdAt) - new Date(message.createdAt) > GAP_MS ||
              new Date(next.createdAt).toDateString() !== new Date(message.createdAt).toDateString());
            const joinsNext = next && !nextStamp && String(next.sender) === String(message.sender);

            // Corners flatten on the side facing the rest of the group
            const corners = isMine
              ? `${joinsPrev ? "rounded-tr-md" : ""} ${joinsNext ? "rounded-br-md" : ""}`
              : `${joinsPrev ? "rounded-tl-md" : ""} ${joinsNext ? "rounded-bl-md" : ""}`;

            return (
              <div key={message.id ?? message._id ?? i}>
                {showStamp && (
                  <p className="my-4 text-center text-xs font-medium text-slate-400">{stampLabel(message.createdAt)}</p>
                )}

                <div className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} ${joinsPrev ? "mt-0.5" : "mt-2"}`}>
                  {!isMine && (
                    joinsNext ? <span className="w-7 shrink-0" /> : <Avatar size="h-7 w-7 text-[10px]" />
                  )}

                  <div
                    title={formatTime(message.createdAt)}
                    className={`${i === messages.length - 1 ? "tf-pop" : ""} max-w-[75%] whitespace-pre-wrap break-words rounded-3xl px-4 py-2 text-sm leading-5 sm:max-w-[65%] ${corners} ${
                      isMine
                        ? "bg-gradient-to-br from-[#4338FF] to-[#9b5cff] text-white"
                        : "bg-slate-100 text-[#0E1530]"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="p-3 sm:px-5 sm:pb-4">
        <div className="flex items-center rounded-full border border-slate-300 bg-white py-1.5 pl-5 pr-2 transition focus-within:border-[#4338FF]">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            aria-label="Message"
            autoComplete="off"
            className="h-9 flex-1 bg-transparent text-sm text-[#0E1530] placeholder:text-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!text.trim()}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-[#4338FF] transition hover:bg-[#EEF1FF] disabled:pointer-events-none disabled:opacity-0 ${focusRing}`}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;