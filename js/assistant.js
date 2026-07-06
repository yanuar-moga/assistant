/**
 * PANDA ASSISTANT - Core Assistant Persona Engine
 * Final Version: Refined for Single Greeting & Persona Sync
 */

const AssistantEngine = {
    current: "Panda",

    async init() {
        const saved = localStorage.getItem("panda_assistant_persona") || "panda";
        this.current = saved;
        
        this.renderWidget();
        this.loadPersona();
        
        const widget = document.getElementById("assistant-widget");
        if (widget) {
            widget.addEventListener("click", () => this.activateChatbox());
        }
    },

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
        
        // PENTING: Pemanggilan ChatEngine.triggerGreeting() dihapus dari sini
        // agar sapaan hanya dikelola di chat.js saat DOMContentLoaded.
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
    },

    applyPersona(name) {
        this.switchPersona(name);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AssistantEngine.init();
});
