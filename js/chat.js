/**
 * PANDA ASSISTANT - Main Chat Execution Engine
 * Perbaikan: Inisialisasi Otomatis Avatar & Persona pada Load
 */
const ChatEngine = {
    SPREADSHEET_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbwx1xLp3t0fgG1idoqsz9vCaEd0A3xo8N9pzcLLY8bzzjn9npvoKijXBFtOg4iekBFn1A/exec",

    init() {
        // Panggil fungsi inisialisasi UI untuk memuat avatar/header tersimpan
        this.initializeUI();

        const input = document.getElementById("chat-input");
        const btnSend = document.getElementById("btn-send");
        const btnClose = document.getElementById("btn-close");

        btnSend.addEventListener("click", () => this.sendMessage());
        input.addEventListener("keydown", (e) => {
            if(e.key === "Enter") this.sendMessage();
            CommandEngine.handleInput(e);
        });
        btnClose.addEventListener("click", () => {
            this.appendMessage("Assistant", "Sampai jumpa lagi! ✨");
            setTimeout(() => AssistantEngine.deactivateChatbox(), 1000);
        });
    },

    // Fungsi baru untuk memastikan avatar tampil saat pertama kali buka
    initializeUI() {
        const savedAssistant = localStorage.getItem("panda_active_assistant") || "panda";
        // Panggil fungsi di AssistantEngine yang mengatur gambar header
        if (typeof AssistantEngine !== 'undefined' && AssistantEngine.applyPersona) {
            AssistantEngine.applyPersona(savedAssistant);
        }
    },

    triggerGreeting() {
        const user = localStorage.getItem("panda_user_name");
        if (!user) {
            this.appendMessage("Assistant", "Halo 👋 Siapa nama Anda?");
            localStorage.setItem("panda_flow_step", "WAITING_NAME");
        } else {
            this.appendMessage("Assistant", `Halo ${user} 👋 Ada yang bisa saya bantu hari ini?`);
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
                this.appendMessage("Assistant", `Salam kenal ${text}! Ketik /help untuk melihat perintah saya.`);
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
        
        const cleanKey = prompt.toLowerCase().trim();
        let keywordHistory = JSON.parse(localStorage.getItem("panda_keyword_history")) || {};
        keywordHistory[cleanKey] = Math.min((keywordHistory[cleanKey] || 0) + 1, 3);
        localStorage.setItem("panda_keyword_history", JSON.stringify(keywordHistory));
        
        try {
            const response = await fetch(`${this.SPREADSHEET_WEB_APP_URL}?action=getFAQ&keyword=${encodeURIComponent(prompt)}&count=${keywordHistory[cleanKey]}`);
            const result = await response.json();
            
            TypingEngine.hide();
            this.markAsRead(userMsgId);
            
            if (result.status === "success" && result.answer) {
                this.appendMessage("Assistant", result.answer);
            } else {
                this.appendMessage("Assistant", "Maaf, data tidak ditemukan. 🐼");
            }
        } catch(e) {
            TypingEngine.hide();
            this.appendMessage("Assistant", "Gagal memuat data dari Spreadsheet.");
            console.error("Fetch Error: ", e);
        }
    }
};
