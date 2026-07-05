/**
 * PANDA ASSISTANT - Core Assistant Persona Engine
 * Updated for Yanuar-Moga Assets (Auto-Load Support)
 */
const AssistantEngine = {
    current: "Panda",

    async init() {
        // Ambil data persona yang tersimpan (jika ada)
        const saved = localStorage.getItem("panda_assistant_persona");
        if (saved) {
            this.current = saved;
        }
        
        // Render widget di pojok layar
        this.renderWidget();
        
        // Muat avatar di header chatbox agar tidak muncul ikon rusak saat pertama buka
        this.loadPersona();
        
        document.getElementById("assistant-widget").addEventListener("click", () => {
            this.activateChatbox();
        });
    },

    // Fungsi untuk memastikan avatar header sesuai dengan pilihan user saat load
    loadPersona() {
        const avatar = document.getElementById("header-avatar");
        const title = document.getElementById("header-title");
        
        if (avatar) {
            const persona = this.current.toLowerCase() === "clippy" ? "clippy" : "panda";
            avatar.src = `https://yanuar-moga.github.io/assistant/assets/icons/${persona}.png`;
        }
        
        if (title) {
            title.innerText = `${this.current.toUpperCase()} ASSISTANT`;
        }
    },

    renderWidget() {
        const gif = document.getElementById("assistant-gif");
        if (!gif) return;

        if (this.current.toLowerCase() === "clippy") {
            gif.src = "https://yanuar-moga.github.io/assistant/assets/icons/clippy.gif";
        } else {
            gif.src = "https://yanuar-moga.github.io/assistant/assets/icons/mypanda.gif";
        }
    },

    activateChatbox() {
        const widget = document.getElementById("assistant-widget");
        const chatbox = document.getElementById("chatbox-container");
        
        widget.style.display = "none";
        chatbox.classList.remove("chatbox-hidden");
        chatbox.classList.remove("crt-shutdown");
        chatbox.classList.add("slide-up");
        
        // Panggil trigger greeting jika ChatEngine sudah siap
        if (typeof ChatEngine !== 'undefined') {
            ChatEngine.triggerGreeting();
        }
    },

    deactivateChatbox() {
        const chatbox = document.getElementById("chatbox-container");
        const widget = document.getElementById("assistant-widget");
        
        chatbox.classList.remove("slide-up");
        chatbox.classList.add("crt-shutdown");
        
        setTimeout(() => {
            chatbox.classList.add("chatbox-hidden");
            widget.style.display = "block";
            this.renderWidget();
        }, 500);
    },

    switchPersona(name) {
        this.current = name;
        localStorage.setItem("panda_assistant_persona", name);
        
        // Update tampilan header
        const avatar = document.getElementById("header-avatar");
        const title = document.getElementById("header-title");
        
        if (avatar) {
            const persona = name.toLowerCase() === "clippy" ? "clippy" : "panda";
            avatar.src = `https://yanuar-moga.github.io/assistant/assets/icons/${persona}.png`;
        }
        
        if (title) {
            title.innerText = `${name.toUpperCase()} ASSISTANT`;
        }
        
        this.renderWidget();
        console.log("Persona switched to:", name);
    }
};

// Inisialisasi engine saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    AssistantEngine.init();
});
