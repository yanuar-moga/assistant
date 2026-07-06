/**
 * PANDA ASSISTANT - Main Chat Execution Engine
 * Version: 1.0 | Build: 5 Juli 2026
 * Final Version: PWA Installed & Chat Execution Engine
 */

const ChatEngine = {
    SPREADSHEET_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbwx1xLp3t0fgG1idoqsz9vCaEd0A3xo8N9pzcLLY8bzzjn9npvoKijXBFtOg4iekBFn1A/exec",
    isClosing: false,

    init() {
        this.initializeUI();
        const input = document.getElementById("chat-input");
        const btnSend = document.getElementById("btn-send");
        const btnClose = document.getElementById("btn-close");

        if (btnSend) btnSend.onclick = () => this.sendMessage();
        if (input) {
            input.onkeydown = (e) => {
                if (e.key === "Enter") this.sendMessage();
            };
        }
        if (btnClose) {
            btnClose.onclick = () => {
                if (this.isClosing) return;
                this.isClosing = true;
                this.appendMessage("Assistant", "Sampai jumpa lagi! ✨");
                setTimeout(() => {
                    AssistantEngine.deactivateChatbox();
                    this.isClosing = false;
                }, 1000);
            };
        }
    },

    initializeUI() {
        const savedAssistant = localStorage.getItem("panda_assistant_persona") || "panda";
        if (typeof AssistantEngine !== 'undefined' && AssistantEngine.applyPersona) {
            AssistantEngine.applyPersona(savedAssistant);
        }
    },

    triggerGreeting() {
        const body = document.getElementById("chat-body");
        if (body && body.children.length > 0) return;
        const user = localStorage.getItem("panda_user_name");
        
        TypingEngine.show();
        setTimeout(() => {
            TypingEngine.hide();
            const versionInfo = "<div style='font-size:0.8em; color:#888; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;'>" +
                                "<b>Panda Assistant</b><br>" +
                                "Version 1.0 | Build 5 Juli 2026 | Dev MB" +
                                "</div>";

            if (!user) {
                this.appendMessage("Assistant", versionInfo + "👋 Halo! Selamat datang. Senang sekali bisa bertemu denganmu. 😊<br><br>Aku adalah Asisten Virtual yang siap membantu menjawab pertanyaanmu. Siapa namamu?");
                localStorage.setItem("panda_flow_step", "WAITING_NAME");
            } else {
                this.appendMessage("Assistant", versionInfo + "Halo kembali, " + user + "! 👋 Senang sekali bisa bertemu denganmu lagi. Ada yang bisa kubantu hari ini? 😊");
            }
        }, 800);
    },

    sendMessage() {
        const input = document.getElementById("chat-input");
        const text = input.value.trim();
        if (!text) return;
        const msgId = "msg-" + Date.now();
        this.appendMessage("User", text, msgId);
        input.value = "";
        Utils.playSound("send");

        const flow = localStorage.getItem("panda_flow_step");
        if (flow === "WAITING_NAME") {
            this.handleNameRegistration(text, msgId);
            return;
        }

        if (text.startsWith("/")) {
            CommandEngine.execute(text);
            this.markAsRead(msgId);
        } else {
            this.processAiResponse(text, msgId);
        }
    },

    async handleNameRegistration(text, msgId) {
        localStorage.setItem("panda_user_name", text);
        localStorage.removeItem("panda_flow_step");
        TypingEngine.show();
        setTimeout(() => {
            TypingEngine.hide();
            this.appendMessage("Assistant", "Salam kenal " + text + "! Senang bisa membantumu. Ketik /help untuk melihat menu perintah.");
            this.markAsRead(msgId);
        }, 1000);
    },

    async processAiResponse(prompt, userMsgId, isCommand = false) {
        TypingEngine.show();
        const userName = localStorage.getItem("panda_user_name") || "Guest";
        const action = isCommand ? "getCommand" : "getFAQ";
        const cleanKey = encodeURIComponent(prompt.toLowerCase().trim());
        
        let count = 1;
        if (!isCommand) {
            let history = JSON.parse(localStorage.getItem("panda_keyword_history")) || {};
            history[prompt.toLowerCase().trim()] = Math.min((history[prompt.toLowerCase().trim()] || 0) + 1, 3);
            count = history[prompt.toLowerCase().trim()];
            localStorage.setItem("panda_keyword_history", JSON.stringify(history));
        }
        
        try {
            const url = this.SPREADSHEET_WEB_APP_URL + "?action=" + action + "&keyword=" + cleanKey + "&count=" + count + "&userName=" + encodeURIComponent(userName);
            const response = await fetch(url);
            const result = await response.json();
            
            TypingEngine.hide();
            this.markAsRead(userMsgId);
            
            if (result.status === "success") {
                let finalAnswer = result.answer.replace(/•/g, "<br>•");
                this.appendMessage("Assistant", finalAnswer);
            } else {
                this.appendMessage("Assistant", "Maaf, data tidak ditemukan.");
            }
        } catch (e) {
            TypingEngine.hide();
            this.appendMessage("Assistant", "Gagal terhubung ke server.");
            console.error(e);
        }
    },

    appendMessage(sender, text, id = "") {
        const body = document.getElementById("chat-body");
        if (!body) return;
        
        const bubble = document.createElement("div");
        const isUser = sender === "User";
        bubble.className = "chat-bubble " + (isUser ? 'chat-right' : 'chat-left');
        if (id) bubble.id = id;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const ticks = isUser ? '<span class="chat-ticks" style="color:#888; margin-left:4px;">✓✓</span>' : '';
        bubble.innerHTML = "<div>" + text + "</div><div class='chat-time'>" + time + ticks + "</div>";
        
        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
        if (!isUser) Utils.playSound("receive");
    },

    markAsRead(id) {
        const msgElement = document.getElementById(id);
        if (msgElement) {
            const ticks = msgElement.querySelector(".chat-ticks");
            if (ticks) ticks.style.color = "#34b7f1";
        }
    },

    clearChat() {
        const body = document.getElementById("chat-body");
        while (body.firstChild) body.removeChild(body.firstChild);
        this.appendMessage("Assistant", "Riwayat chat telah dibersihkan!");
    }
};

const CommandEngine = {
    execute(text) {
        const cmd = text.toLowerCase().trim();
        if (cmd === "/cls" || cmd === "/clear") {
            ChatEngine.clearChat();
        } else if (cmd.startsWith("/assistant")) {
            const name = cmd.replace("/assistant", "").trim();
            if (name === "clippy" || name === "panda") {
                AssistantEngine.switchPersona(name);
                ChatEngine.appendMessage("Assistant", "Persona diubah ke: " + name.toUpperCase());
            } else {
                ChatEngine.appendMessage("Assistant", "Gunakan: /assistant clippy atau /assistant panda");
            }
        } else {
            ChatEngine.processAiResponse(cmd, "msg-cmd", true);
        }
    }
};

/** PWA Installation Logic **/
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('btn-install');
    if(btn) btn.style.display = 'block';
});

document.getElementById('btn-install')?.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install');
            }
            deferredPrompt = null;
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    ChatEngine.init();
    setTimeout(() => { ChatEngine.triggerGreeting(); }, 1000);
});
