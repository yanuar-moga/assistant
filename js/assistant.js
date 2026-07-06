/**
 * PANDA ASSISTANT - Core Assistant Persona Engine
 * Final Version: Full Sync with Auto-Load and Header UI
 */

const AssistantEngine = {
    current: "Panda",

    async init() {
        // Ambil data persona yang tersimpan (default ke "panda")
        const saved = localStorage.getItem("panda_assistant_persona") || "panda";
        this.current = saved;
        
        // Render widget di pojok layar
        this.renderWidget();
        
        // Sinkronisasi header chatbox agar tidak ikon rusak
        this.loadPersona();
        
        // Event listener untuk klik widget
        const widget = document.getElementById("assistant-widget");
        if (widget) {
            widget.addEventListener("click", () => this.activateChatbox());
        }
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
        
        if (widget) widget.style.display = "none";
        if (chatbox) {
            chatbox.classList.remove("chatbox-hidden");
            chatbox.classList.remove("crt-shutdown");
            chatbox.classList.add("slide-up");
        }
        
        // Panggil trigger greeting jika ChatEngine sudah tersedia
        if (typeof ChatEngine !== 'undefined') {
            ChatEngine.triggerGreeting();
        }
    },

    deactivateChatbox() {
        const chatbox = document.getElementById("chatbox-container");
        const widget = document.getElementById("assistant-widget");
        
        if (chatbox) {
            chatbox.classList.remove("slide-up");
            chatbox.classList.add("crt-shutdown");
        }
        
        setTimeout(() => {
            if (chatbox) chatbox.classList.add("chatbox-hidden");
            if (widget) widget.style.display = "block";
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
    },

    // Alias untuk kecocokan kode lama jika dipanggil dari luar
    applyPersona(name) {
        this.switchPersona(name);
    }
};

// Inisialisasi engine saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    AssistantEngine.init();
});
