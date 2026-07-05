/**
 * PANDA ASSISTANT - Core Assistant Persona Engine
 * Updated for Yanuar-Moga Assets
 */
const AssistantEngine = {
    current: "Panda",

    async init() {
        // Mengambil persona terakhir dari memori (localStorage)
        const saved = localStorage.getItem("panda_assistant_persona");
        if(saved) this.current = saved;
        
        this.renderWidget();
        
        document.getElementById("assistant-widget").addEventListener("click", () => {
            this.activateChatbox();
        });
    },

    // Fungsi otomatis untuk mengganti GIF karakter berdasarkan persona
    renderWidget() {
        const gif = document.getElementById("assistant-gif");
        if (!gif) return;

        const pandaGif = "https://yanuar-moga.github.io/assistant/assets/icons/mypanda.gif";
        const clippyGif = "https://yanuar-moga.github.io/assistant/assets/icons/clippy.gif";

        if (this.current.toLowerCase() === "panda") {
            gif.src = pandaGif;
        } else if (this.current.toLowerCase() === "clippy") {
            gif.src = clippyGif;
        } else {
            // Default fallback
            gif.src = pandaGif;
        }
    },

    activateChatbox() {
        const widget = document.getElementById("assistant-widget");
        const chatbox = document.getElementById("chatbox-container");
        
        widget.style.display = "none";
        chatbox.classList.remove("chatbox-hidden");
        chatbox.classList.remove("crt-shutdown");
        chatbox.classList.add("slide-up");
        
        // Panggil fungsi sapaan jika tersedia di ChatEngine
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

    // Fungsi untuk mengganti persona dan memperbarui UI secara real-time
    switchPersona(name) {
        this.current = name;
        localStorage.setItem("panda_assistant_persona", name);
        
        const avatar = document.getElementById("header-avatar");
        const title = document.getElementById("header-title");
        
        // Update Ikon Header
        if (name.toLowerCase() === "panda") {
            avatar.src = "https://yanuar-moga.github.io/assistant/assets/panda.png";
        } else {
            avatar.src = "https://yanuar-moga.github.io/assistant/assets/icons/clippy.png";
        }
        
        // Update Judul Header
        title.innerText = `${name.toUpperCase()} ASSISTANT`;
        
        // Update Gambar Widget Utama
        this.renderWidget();
        
        console.log("Persona switched to:", name);
    }
};

// Inisialisasi Engine saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    AssistantEngine.init();
});
