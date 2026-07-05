const ApiEngine = {
    baseUrl: "https://script.google.com/macros/s/AKfycbwx1xLp3t0fgG1idoqsz9vCaEd0A3xo8N9pzcLLY8bzzjn9npvoKijXBFtOg4iekBFn1A/exec", // Ganti dengan Web App URL Anda

    async post(endpoint, data) {
        const res = await fetch(`${this.baseUrl}?endpoint=${endpoint}`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async registerUser(name) {
        return this.post("/account", { action: "register", name: name });
    }
};
