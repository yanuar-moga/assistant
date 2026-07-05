/**
 * PANDA ASSISTANT - Typing Indicator Controller
 */
const TypingEngine = {
    show() {
        const el = document.getElementById("typing-indicator");
        if(el) el.classList.remove("hide-typing");
    },
    hide() {
        const el = document.getElementById("typing-indicator");
        if(el) el.classList.add("hide-typing");
    }
};
