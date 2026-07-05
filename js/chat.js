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

        this.appendMessage("User", text);
        input.value = "";
        
        const flow = localStorage.getItem("panda_flow_step");
        if(flow === "WAITING_NAME") {
            localStorage.setItem("panda_user_name", text);
            localStorage.removeItem("panda_flow_step");
            TypingEngine.show();
            setTimeout(() => {
                TypingEngine.hide();
                this.appendMessage("Assistant", `Salam kenal ${text}! Sila ketik /help untuk melihat daftar perintah pintar saya.`);
                ApiEngine.registerUser(text);
            }, 1000);
            return;
        }

        if(text.startsWith("/")) {
            CommandEngine.execute(text);
        } else {
            this.processAiResponse(text);
        }
    },

    appendMessage(sender, text) {
        const body = document.getElementById("chat-body");
        const bubble = document.createElement("div");
        const isUser = sender === "User";
        
        bubble.className = `chat-bubble ${isUser ? 'chat-right' : 'chat-left'}`;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        bubble.innerHTML = `<div>${text}</div><div class="chat-time">${time} ${isUser ? '<span style="color:#34b7f1">✓✓</span>' : ''}</div>`;
        
        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
    },

    async processAiResponse(prompt) {
        TypingEngine.show();
        try {
            const res = await ApiEngine.post("/chat", { prompt: prompt, user: localStorage.getItem("panda_user_name") });
            TypingEngine.hide();
            this.appendMessage("Assistant", res.data.reply);
        } catch(e) {
            TypingEngine.hide();
            this.appendMessage("Assistant", "Maaf, koneksi backend terputus. Silakan coba sesaat lagi.");
        }
    }
};
