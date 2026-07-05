const TypingEngine = {
    show() {
        const el = document.getElementById("typing-indicator");
        el.classList.remove("hide-typing");
    },
    hide() {
        const el = document.getElementById("typing-indicator");
        el.classList.add("hide-typing");
    }
};
