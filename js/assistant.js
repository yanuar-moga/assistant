const AssistantEngine = {
    current: "Panda",
    config: {},

    async init() {
        const saved = localStorage.getItem("panda_assistant_persona");
        if(saved) this.current = saved;
        this.renderWidget();
        
        document.getElementById("assistant-widget").addEventListener("click", () => {
            this.activateChatbox();
        });
    },

    renderWidget() {
        const gif = document.getElementById("assistant-gif");
        // Pemetaan dinamis karakter
        gif.src = `assets/assistants/${this.current.toLowerCase()}/idle.gif`;
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
        this.renderWidget();
        
        const avatar = document.getElementById("header-avatar");
        avatar.src = `assets/icons/${name.toLowerCase()}.png`;
        document.getElementById("header-title").innerText = `${name.toUpperCase()} ASSISTANT`;
    }
};
