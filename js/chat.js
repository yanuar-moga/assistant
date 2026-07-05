/**
 * PANDA ASSISTANT - Main Chat Execution Engine
 * Diperbarui untuk integrasi langsung dengan Google Apps Script Web App (ChatFAQ)
 * Fitur: Pelacakan frekuensi pertanyaan bertingkat (Count 1, 2, 3) lewat LocalStorage
 */
const ChatEngine = {
    // URL Deployment Google Apps Script Anda
    SPREADSHEET_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbwx1xLp3t0fgG1idoqsz9vCaEd0A3xo8N9pzcLLY8bzzjn9npvoKijXBFtOg4iekBFn1A/exec",

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

        // Berikan ID unik pada pesan user untuk mengontrol status centang nantinya
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
            // Jalankan pencarian kata kunci ke Google Sheets
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
        // Pesan user diberi centang default abu-abu (#888)
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
            if(ticks) ticks.style.color = "#34b7f1"; // Berubah warna biru khas WhatsApp
        }
    },

    async processAiResponse(prompt, userMsgId) {
        // Tampilkan animasi tiga titik melompat (... )
        TypingEngine.show();
        
        // 1. Logika Tracking Riwayat Kata Kunci di Sisi Client Browser
        const cleanKey = prompt.toLowerCase().trim();
        let keywordHistory = JSON.parse(localStorage.getItem("panda_keyword_history")) || {};
        
        // Naikkan hitungan pertanyaan jika pernah ditanyakan sebelumnya (Maksimal mentok di angka 3)
        if (keywordHistory[cleanKey]) {
            keywordHistory[cleanKey] = Math.min(keywordHistory[cleanKey] + 1, 3);
        } else {
            keywordHistory[cleanKey] = 1;
        }
        
        localStorage.setItem("panda_keyword_history", JSON.stringify(keywordHistory));
        const currentCount = keywordHistory[cleanKey];
        
        try {
            // Request GET murni dengan parameter keyword dan count bertingkat
            const response = await fetch(`${this.SPREADSHEET_WEB_APP_URL}?action=getFAQ&keyword=${encodeURIComponent(prompt)}&count=${currentCount}`, {
                method: "GET"
            });
            
            if (!response.ok) {
                throw new Error("Gagal mengambil data dari Google Apps Script");
            }
            
            const result = await response.json();
            
            // Sembunyikan animasi loading setelah respons diterima
            TypingEngine.hide();
            
            // Berhasil terhubung ke server -> Ubah centang abu menjadi biru
            this.markAsRead(userMsgId);
            
            // Memeriksa status dan ketersediaan data answer dari sheet ChatFAQ
            if (result.status === "success" && result.answer) {
                this.appendMessage("Assistant", result.answer);
            } else {
                this.appendMessage("Assistant", "Maaf, kata kunci tidak ditemukan dalam database ChatFAQ Panda. Coba gunakan pertanyaan atau perintah lain.");
            }
        } catch(e) {
            // Penanganan jika jaringan komputer/hosting putus
            TypingEngine.hide();
            this.appendMessage("Assistant", "Maaf, gagal memuat data dari Spreadsheet. Pastikan URL Web App sudah dideploy sebagai 'Anyone'.");
            console.error("GET Fetch Error: ", e);
        }
    }
};
