// AI Tutor chatbox — sends questions to the Netlify function at /api/chat.
(function () {
  const fab = document.getElementById("chatFab");
  const panel = document.getElementById("chatPanel");
  const closeBtn = document.getElementById("chatClose");
  const body = document.getElementById("chatBody");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatText");
  const sendBtn = document.getElementById("chatSend");
  if (!fab || !panel) return;

  function openPanel() {
    panel.hidden = false;
    fab.hidden = true;
    setTimeout(() => input.focus(), 100);
  }
  function closePanel() {
    panel.hidden = true;
    fab.hidden = false;
  }
  fab.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);

  // Auto-grow the textarea as the user types.
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  });

  // Enter sends, Shift+Enter adds a new line.
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = "chat-msg " + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  let busy = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;

    addMsg(text, "user");
    input.value = "";
    input.style.height = "auto";
    busy = true;
    sendBtn.disabled = true;

    const typing = addMsg("Soch raha hun… 🤔", "bot typing");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json().catch(() => ({}));
      typing.remove();
      if (res.ok && data.reply) {
        addMsg(data.reply, "bot");
      } else {
        addMsg(
          "⚠️ " +
            (data.error || "Kuch gadbad ho gayi. Thodi der baad try karo."),
          "bot",
        );
      }
    } catch {
      typing.remove();
      addMsg("⚠️ Internet ya server issue. Dobara try karo.", "bot");
    } finally {
      busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  });

  // Let other parts of the app send a question straight to the tutor.
  window.askSolveSathi = function (text) {
    if (!text) return;
    openPanel();
    input.value = text;
    input.style.height = "auto";
    form.requestSubmit();
  };
})();
