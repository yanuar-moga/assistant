/**
 * PANDA ASSISTANT - Main Chat Execution Engine
 */
const ChatEngine = {
    init() {
        const input = document.getElementById("chat-input");
        const btnSend = document.getElementById("btn-send");
        const btnClose = document.getElementById("btn-close");

        btnSend.addEventListener("click", () => this.sendMessage());
        input.addEventListener("keydown", (e) => {
            if(e.key === "Enter") this.sendMessage();
            CommandEngine.handleInput(e);
        });
        btnClose.addEventListener("click", () => {
            this.appendMessage("Assistant", "Sampai jumpa lagi! Tetap semangat belajar Informatika! ✨");
            setTimeout(() => AssistantEngine.deactivateChatbox(), 1000);
        });
    },

    triggerGreeting() {
        const user = localStorage.getItem("panda_user_name");
        if (!user) {
            this.appendMessage("Assistant", "Halo 👋 Siapa nama Anda?");
            localStorage.setItem("panda_flow_step", "WAITING_NAME");
        } else {
            this.appendMessage("Assistant", `Halo ${user} 👋 Ada yang bisa saya bantu dalam pelajaran Informatika hari ini?`);
        }
    },

    sendMessage() {
        const input = document.getElementById("chat-input");
        const text = input.value.trim();
        if(!text) return;

        const msgId = "msg-" + Date.now();
        this.appendMessage("User", text, msgId);
        input.value = "";
        Utils.playSound("send");
        
        const flow = localStorage.getItem("panda_flow_step");
        if(flow === "WAITING_NAME") {
            localStorage.setItem("panda_user_name", text);
            localStorage.removeItem("panda_flow_step");
            
            TypingEngine.show();
            setTimeout(() => {
                TypingEngine.hide();
                this.appendMessage("Assistant", `Salam kenal ${text}! Sila ketik /help untuk melihat daftar perintah pintar saya.`);
                this.markAsRead(msgId);
                ApiEngine.registerUser(text);
            }, 1000);
            return;
        }

        if(text.startsWith("/")) {
            CommandEngine.execute(text);
            this.markAsRead(msgId);
        } else {
            this.processAiResponse(text, msgId);
        }
    },

    appendMessage(sender, text, id = "") {
        const body = document.getElementById("chat-body");
        const bubble = document.createElement("div");
        const isUser = sender === "User";
        
        bubble.className = `chat-bubble ${isUser ? 'chat-right' : 'chat-left'}`;
        if(id) bubble.id = id;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const ticksHtml = isUser ? `<span class="chat-ticks" style="color:#888; margin-left:4px;">✓✓</span>` : '';
        
        bubble.innerHTML = `<div>${text}</div><div class="chat-time">${time} ${ticksHtml}</div>`;
        
        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
        if(!isUser) Utils.playSound("receive");
    },

    markAsRead(id) {
        if(!id) return;
        const msgElement = document.getElementById(id);
        if(msgElement) {
            const ticks = msgElement.querySelector(".chat-ticks");
            if(ticks) ticks.style.color = "#34b7f1"; 
        }
    },

    async processAiResponse(prompt, userMsgId) {
        TypingEngine.show();
        try {
            const res = await ApiEngine.post("/chat", { prompt: prompt, user: localStorage.getItem("panda_user_name") });
            TypingEngine.hide();
            this.markAsRead(userMsgId);
            this.appendMessage("Assistant", res.data.reply);
        } catch(e) {
            TypingEngine.hide();
            this.appendMessage("Assistant", "Maaf, koneksi backend terputus atau gagal membaca server. Silakan periksa jaringan Anda.");
        }
    }
};
