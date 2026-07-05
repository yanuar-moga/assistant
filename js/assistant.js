/**
 * PANDA ASSISTANT - Core Assistant Persona Engine
 */
const AssistantEngine = {
    current: "Panda",

    async init() {
        const saved = localStorage.getItem("panda_assistant_persona");
        if(saved) this.current = saved;
        
        this.renderWidget();
        
        document.getElementById("assistant-widget").addEventListener("click", () => {
            this.activateChatbox();
        });
    },

    renderWidget() {
        const gif = document.getElementById("assistant-widget").querySelector("img");
        // Menggunakan URL lengkap sesuai permintaan Anda
        if (this.current.toLowerCase() === "panda") {
            gif.src = "https://yanuar-moga.github.io/assistant/assets/icons/mypanda.gif";
        } else {
            gif.src = "https://yanuar-moga.github.io/assistant/assets/icons/clippy.gif";
        }
    },

    activateChatbox() {
        const widget = document.getElementById("assistant-widget");
        const chatbox = document.getElementById("chatbox-container");
        
        widget.style.display = "none";
        chatbox.classList.remove("chatbox-hidden");
        chatbox.classList.remove("crt-shutdown");
        chatbox.classList.add("slide-up");
        
        ChatEngine.triggerGreeting();
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
        
        const avatar = document.getElementById("header-avatar");
        // Update ikon header chatbox dengan URL lengkap
        if (name.toLowerCase() === "panda") {
            avatar.src = "https://yanuar-moga.github.io/assistant/assets/panda.png";
        } else {
            // Jika Anda punya ikon png untuk clippy, ganti URL di bawah ini
            avatar.src = "https://yanuar-moga.github.io/assistant/assets/icons/clippy.png"; 
        }
        
        document.getElementById("header-title").innerText = `${name.toUpperCase()} ASSISTANT`;
        this.renderWidget();
    }
};
