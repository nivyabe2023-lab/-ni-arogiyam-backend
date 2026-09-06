import React, { useState, useEffect } from "react";
import "./Messages.css";
import API_BASE_URL from "./config";

const DEFAULT_MESSAGES = [
  {
    id: 1,
    messageId: 1,
    name: "Dr. Rajeshwar Patel",
    phone: "+91 98450 12345",
    email: "rajeshwar.patel@gmail.com",
    message: "Inquiring about VIP Executive Health Checkup package for my parents next week. Can we pre-book fasting blood tests?",
    status: "REPLIED",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    reply: "Dear Dr. Patel, Thank you for reaching out. Yes, the VIP Executive package includes pre-booked fasting tests. Our coordinator will assist you.",
    repliedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    repliedBy: "Administrator",
  },
  {
    id: 2,
    messageId: 2,
    name: "Ananya Sundaram",
    phone: "+91 97112 88390",
    email: "ananya.sundaram@outlook.com",
    message: "Need urgent confirmation regarding cashless TPA insurance claims for Star Health in the Cardiology ward.",
    status: "NEW",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    reply: null,
    repliedAt: null,
    repliedBy: null,
  },
];

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, NEW, REPLIED
  const [replyModalTarget, setReplyModalTarget] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Load messages from localStorage & backend
  const loadMessages = async () => {
    let localMsgs = [];
    try {
      const stored = localStorage.getItem("hospital_contact_messages");
      if (stored) {
        localMsgs = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading local messages:", e);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact-messages`);
      if (res.ok) {
        const backendMsgs = await res.json();
        if (Array.isArray(backendMsgs)) {
          // Merge backend with local messages without duplicates
          const merged = [...localMsgs];
          backendMsgs.forEach((bm) => {
            const exists = merged.some(
              (m) => String(m.id) === String(bm.id) || String(m.messageId) === String(bm.messageId)
            );
            if (!exists) {
              merged.push(bm);
            }
          });
          // Sort newest first
          merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMessages(merged);
          localStorage.setItem("hospital_contact_messages", JSON.stringify(merged));
          return;
        }
      }
    } catch (err) {
      console.warn("Backend messages query fallback:", err);
    }

    if (localMsgs && localMsgs.length > 0) {
      setMessages(localMsgs);
    } else {
      setMessages(DEFAULT_MESSAGES);
      localStorage.setItem("hospital_contact_messages", JSON.stringify(DEFAULT_MESSAGES));
    }
  };

  useEffect(() => {
    loadMessages();

    // Set up real-time listener via storage event & CustomEvent
    const handleUpdate = () => {
      loadMessages();
    };

    window.addEventListener("hospital_messages_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    let bc = null;
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel("hospital_messages_channel");
      bc.onmessage = () => {
        loadMessages();
      };
    }

    // Polling interval every 3 seconds for immediate real-time sync
    const interval = setInterval(loadMessages, 3000);

    return () => {
      window.removeEventListener("hospital_messages_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, []);

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this contact inquiry?")) {
      return;
    }

    const targetId = id;
    const updated = messages.filter(
      (m) => String(m.id) !== String(targetId) && String(m.messageId) !== String(targetId)
    );
    setMessages(updated);
    localStorage.setItem("hospital_contact_messages", JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/api/contact-messages/${targetId}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.warn("Delete API error:", e);
    }

    // Broadcast change
    window.dispatchEvent(new CustomEvent("hospital_messages_updated", { detail: { type: "MESSAGE_DELETED", id: targetId } }));
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("hospital_messages_channel");
      bc.postMessage({ type: "MESSAGE_DELETED", id: targetId });
      bc.close();
    }
  };

  const handleOpenReplyModal = (msg) => {
    setReplyModalTarget(msg);
    setReplyText(msg.reply || "");
  };

  const handleCloseReplyModal = () => {
    setReplyModalTarget(null);
    setReplyText("");
    setIsSendingReply(false);
  };

  const handleSendReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyModalTarget || !replyText.trim()) return;

    setIsSendingReply(true);
    const adminUser = localStorage.getItem("loggedInUser") || "Administrator";
    const nowIso = new Date().toISOString();
    const targetId = replyModalTarget.id || replyModalTarget.messageId;

    const updated = messages.map((m) => {
      if (
        String(m.id) === String(targetId) ||
        String(m.messageId) === String(targetId)
      ) {
        return {
          ...m,
          reply: replyText.trim(),
          status: "REPLIED",
          repliedAt: nowIso,
          repliedBy: adminUser,
        };
      }
      return m;
    });

    setMessages(updated);
    localStorage.setItem("hospital_contact_messages", JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/api/contact-messages/${targetId}/reply`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: replyText.trim(),
          repliedBy: adminUser,
        }),
      });
    } catch (err) {
      console.warn("Reply API error:", err);
    }

    window.dispatchEvent(new CustomEvent("hospital_messages_updated", { detail: { type: "MESSAGE_REPLIED", id: targetId } }));
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("hospital_messages_channel");
      bc.postMessage({ type: "MESSAGE_REPLIED", id: targetId });
      bc.close();
    }

    setIsSendingReply(false);
    handleCloseReplyModal();
  };

  const applyTemplate = (text) => {
    setReplyText((prev) => (prev ? `${prev}\n\n${text}` : text));
  };

  // Filter & search
  const filteredMessages = messages.filter((m) => {
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !s ||
      (m.name && m.name.toLowerCase().includes(s)) ||
      (m.phone && m.phone.toLowerCase().includes(s)) ||
      (m.email && m.email.toLowerCase().includes(s)) ||
      (m.message && m.message.toLowerCase().includes(s));

    if (!matchesSearch) return false;

    if (activeFilter === "NEW") {
      return m.status === "NEW" || m.status === "UNREAD";
    }
    if (activeFilter === "REPLIED") {
      return m.status === "REPLIED";
    }
    return true;
  });

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === "NEW" || m.status === "UNREAD").length;
  const repliedCount = messages.filter((m) => m.status === "REPLIED").length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="messages-page">
      {/* TOP HEADER */}
      <div className="messages-header-row">
        <div className="messages-title-area">
          <h1>📬 Patient Inquiries &amp; Contact Messages</h1>
          <p>Real-time communication center for inquiries submitted on the public hospital portal</p>
        </div>

        <div className="messages-header-actions">
          <span className="live-pulse-badge">
            <span className="pulse-dot"></span>
            Real-time Live Sync
          </span>
          <button
            type="button"
            className="btn-refresh-messages"
            onClick={loadMessages}
            title="Refresh messages from backend"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="messages-stats-grid">
        <div className="msg-stat-card">
          <div className="stat-icon-wrap total">📬</div>
          <div>
            <strong>{totalCount}</strong>
            <span>Total Inquiries Received</span>
          </div>
        </div>
        <div className="msg-stat-card">
          <div className="stat-icon-wrap unread">⏳</div>
          <div>
            <strong>{unreadCount}</strong>
            <span>Pending / Unread</span>
          </div>
        </div>
        <div className="msg-stat-card">
          <div className="stat-icon-wrap replied">✅</div>
          <div>
            <strong>{repliedCount}</strong>
            <span>Answered &amp; Replied</span>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="messages-toolbar">
        <div className="messages-search-box">
          <span className="search-icon-inside">🔍</span>
          <input
            type="text"
            placeholder="Search inquiries by name, email, phone, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="messages-filter-tabs">
          <button
            type="button"
            className={`msg-tab-btn ${activeFilter === "ALL" ? "active" : ""}`}
            onClick={() => setActiveFilter("ALL")}
          >
            All Messages ({totalCount})
          </button>
          <button
            type="button"
            className={`msg-tab-btn ${activeFilter === "NEW" ? "active" : ""}`}
            onClick={() => setActiveFilter("NEW")}
          >
            Pending / Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={`msg-tab-btn ${activeFilter === "REPLIED" ? "active" : ""}`}
            onClick={() => setActiveFilter("REPLIED")}
          >
            Replied ({repliedCount})
          </button>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="messages-list-container">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => {
            const isNew = msg.status === "NEW" || msg.status === "UNREAD";
            const initial = (msg.name || "U").charAt(0).toUpperCase();

            return (
              <div
                key={msg.id || msg.messageId}
                className={`msg-card ${isNew ? "new-msg" : "replied-msg"}`}
              >
                <div className="msg-card-top">
                  <div className="sender-identity">
                    <div className="sender-avatar">{initial}</div>
                    <div className="sender-names">
                      <h4>{msg.name || "Anonymous Visitor"}</h4>
                      <div className="sender-meta-links">
                        {msg.phone && (
                          <a href={`tel:${msg.phone}`}>
                            📞 {msg.phone}
                          </a>
                        )}
                        {msg.email && (
                          <a href={`mailto:${msg.email}`}>
                            ✉️ {msg.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="msg-top-right">
                    <span className="msg-date-badge">
                      📅 {formatDate(msg.createdAt)}
                    </span>
                    <span
                      className={`msg-status-pill ${
                        isNew ? "new" : "replied"
                      }`}
                    >
                      {isNew ? "● Pending Reply" : "✓ Replied"}
                    </span>
                  </div>
                </div>

                <div className="msg-text-bubble">
                  <p>{msg.message}</p>
                </div>

                {msg.reply && (
                  <div className="msg-replied-box">
                    <div className="replied-header">
                      <span>
                        💬 Official Response by{" "}
                        <strong>{msg.repliedBy || "Hospital Administrator"}</strong>
                      </span>
                      {msg.repliedAt && (
                        <span>🕒 {formatDate(msg.repliedAt)}</span>
                      )}
                    </div>
                    <div className="replied-body">{msg.reply}</div>
                  </div>
                )}

                <div className="msg-card-actions">
                  <button
                    type="button"
                    className="btn-msg-reply"
                    onClick={() => handleOpenReplyModal(msg)}
                  >
                    💬 {msg.reply ? "Edit / Re-send Reply" : "Reply to Patient"}
                  </button>
                  <button
                    type="button"
                    className="btn-msg-delete"
                    onClick={() => handleDeleteMessage(msg.id || msg.messageId)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-messages-placeholder">
            <span className="empty-icon">📭</span>
            <h3>No Contact Inquiries Found</h3>
            <p>
              {searchTerm || activeFilter !== "ALL"
                ? "No inquiries matched your current filter criteria."
                : "New messages sent from the public hospital contact form will appear here in real time."}
            </p>
          </div>
        )}
      </div>

      {/* REPLY MODAL */}
      {replyModalTarget && (
        <div className="reply-modal-overlay" onClick={handleCloseReplyModal}>
          <div
            className="reply-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reply-modal-header">
              <h3>
                <span>💬</span> Reply to {replyModalTarget.name}
              </h3>
              <button
                type="button"
                className="reply-close-btn"
                onClick={handleCloseReplyModal}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendReplySubmit}>
              <div className="reply-modal-body">
                <div className="reply-recipient-summary">
                  <div className="recipient-name-row">
                    Recipient: {replyModalTarget.name}
                  </div>
                  <div className="recipient-contacts-row">
                    <span>Email: {replyModalTarget.email || "N/A"}</span> &bull;{" "}
                    <span>Phone: {replyModalTarget.phone || "N/A"}</span>
                  </div>
                  <div className="recipient-quote-box">
                    "{replyModalTarget.message}"
                  </div>
                </div>

                <div style={{ marginBottom: "8px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    Quick Response Templates:
                  </label>
                </div>
                <div className="reply-template-pills">
                  <button
                    type="button"
                    className="btn-template-pill"
                    onClick={() =>
                      applyTemplate(
                        "Dear " +
                          replyModalTarget.name +
                          ", Thank you for contacting NI AROGIYAM Hospital. Our outpatient desk has scheduled a slot for you. Please bring any prior medical records."
                      )
                    }
                  >
                    + Consultation Follow-up
                  </button>
                  <button
                    type="button"
                    className="btn-template-pill"
                    onClick={() =>
                      applyTemplate(
                        "Hello " +
                          replyModalTarget.name +
                          ", Yes, cashless hospitalization is supported for major TPA networks including Star Health, HDFC ERGO, and MediAssist. Our TPA desk is active 24/7."
                      )
                    }
                  >
                    + Cashless TPA Help
                  </button>
                  <button
                    type="button"
                    className="btn-template-pill"
                    onClick={() =>
                      applyTemplate(
                        "Dear " +
                          replyModalTarget.name +
                          ", Our executive health packages are available on all days. Fasting blood samples are collected from 07:00 AM onwards."
                      )
                    }
                  >
                    + Health Packages Info
                  </button>
                </div>

                <div className="reply-textarea-group">
                  <label>Official Response Message *</label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Type your official hospital reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="reply-modal-footer">
                <button
                  type="button"
                  className="btn-cancel-reply"
                  onClick={handleCloseReplyModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingReply}
                  className="btn-send-reply-action"
                >
                  {isSendingReply ? "Saving..." : "✓ Send & Save Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
