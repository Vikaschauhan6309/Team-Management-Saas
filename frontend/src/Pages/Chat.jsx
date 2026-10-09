import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, UserX } from "lucide-react";
import PageLoader from "../Components/UI/PageLoader";
import EmptyState from "../Components/UI/EmptyState";
import ChatBox from "../Components/Chat/ChatBox";
import api from "../Utils/api";
import { getErrorMessage } from "../Utils/helpers";

/* Palette: ink #0E1530 · indigo #4338FF · mint #14B88A · sky #EEF1FF */

const styles = `
@keyframes tf-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.tf-rise{opacity:0;animation:tf-rise .6s cubic-bezier(.2,.7,.2,1) forwards}
@media (prefers-reduced-motion:reduce){.tf-rise{animation:none;opacity:1}}
`;

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(null);

  // No single-user endpoint for chats, so find the contact in the chats list
  useEffect(() => {
    api.get("/api/chats")
      .then((res) => setContacts(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error));
        setContacts([]);
      });
  }, []);

  if (!contacts) return <PageLoader />;

  const contact = contacts.find((item) => item._id === id);
  const goBack = () => navigate("/conversations");

  if (!contact) {
    return (
      <>
        <style>{styles}</style>

        <div className="tf-rise rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <EmptyState
            icon={UserX}
            title="Conversation not found"
            description="This person isn't available to chat with."
            action={
              <button
                onClick={goBack}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0E1530] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4338FF]"
              >
                <ArrowLeft size={16} /> Back to conversations
              </button>
            }
          />
        </div>
      </>
    );
  }

  return <ChatBox key={contact._id} contact={contact} onBack={goBack} />;
};

export default Chat;