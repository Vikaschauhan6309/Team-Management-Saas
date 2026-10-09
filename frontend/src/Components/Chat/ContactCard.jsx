import { initials } from "../../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const avatarGradients = [
  "from-[#4338FF] to-[#8c85ff]",
  "from-[#14B88A] to-[#5eead4]",
  "from-[#f59e0b] to-[#fcd34d]",
  "from-[#ec4899] to-[#f9a8d4]",
];

const ContactCard = ({ contact, active, onClick }) => {
  // Same name always gets the same avatar color
  const avatarColor = avatarGradients[(contact.name || "").length % avatarGradients.length];

  return (
    <button
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF] ${
        active
          ? "bg-[#0E1530] text-white shadow-[0_10px_24px_-14px_rgba(14,21,48,.9)]"
          : "hover:bg-[#EEF1FF]"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${avatarColor} ${
          active ? "ring-2 ring-white/30" : ""
        }`}
      >
        {initials(contact.name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`truncate text-sm font-semibold ${active ? "text-white" : "text-[#0E1530]"}`}>
            {contact.name}
          </p>

          {contact.role && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                active ? "bg-white/15 text-white" : "bg-[#EEF1FF] text-[#4338FF]"
              }`}
            >
              {contact.role}
            </span>
          )}
        </div>

        <p className={`truncate text-xs ${active ? "text-slate-300" : "text-slate-400"}`}>
          {contact.email}
        </p>
      </div>
    </button>
  );
};

export default ContactCard;