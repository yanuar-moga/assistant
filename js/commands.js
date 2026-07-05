const CommandEngine = {
    list: ["/help", "/cls", "/about", "/version", "/assistant", "/password"],

    handleInput(e) {
        const val = e.target.value;
        const popup = document.getElementById("command-autocomplete");
        if(val.startsWith("/")) {
            popup.classList.remove("hide-popup");
            const filter = this.list.filter(c => c.startsWith(val));
            popup.innerHTML = filter.map(c => `<div class="autocomplete-item" onclick="CommandEngine.select('${c}')">${c}</div>`).join('');
        } else {
            popup.classList.add("hide-popup");
        }
    },

    select(cmd) {
        const input = document.getElementById("chat-input");
        input.value = cmd + " ";
        document.getElementById("command-autocomplete").classList.add("hide-popup");
        input.focus();
    },

    execute(cmdText) {
        const parts = cmdText.split(" ");
        const baseCmd = parts[0].toLowerCase();
        
        if(baseCmd === "/cls") {
            document.getElementById("chat-body").innerHTML = "";
        } else if(baseCmd === "/assistant") {
            if(parts[1]) {
                const name = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
                AssistantEngine.switchPersona(name);
                ChatEngine.appendMessage("Assistant", `Karakter berhasil diubah menjadi ${name}.`);
            } else {
                ChatEngine.appendMessage("Assistant", "Gunakan parameter: /assistant [panda|clippy|merlin|rocky]");
            }
        } else if(baseCmd === "/help") {
            ChatEngine.appendMessage("Assistant", `Daftar Perintah:<br><b>/help</b> - Bantuan<br><b>/cls</b> - Bersihkan Layar<br><b>/assistant [nama]</b> - Ganti Karakter<br><b>/password [layanan]</b> - Password Manager`);
        } else {
            ChatEngine.processAiResponse(cmdText);
        }
    }
};
