/**
 * PANDA ASSISTANT - Long-term & Short-term Memory Module
 * Menyimpan fakta-fakta unik mengenai preferensi pengguna secara lokal dan cloud.
 */
const MemoryEngine = {
    localContext: {},

    /**
     * Menyimpan data fakta baru ke dalam memori aplikasi
     * @param {string} key - Kunci informasi (misal: 'FavoriteTopic')
     * @param {string} value - Isi informasi (misal: 'Informatika - Berpikir Komputasional')
     */
    set(key, value) {
        this.localContext[key] = value;
        // Sinkronisasi ke LocalStorage agar tidak hilang saat refresh
        localStorage.setItem(`panda_mem_${key}`, value);
        
        // Kirim asinkron ke Spreadsheet database jika user sudah teregistrasi
        const username = localStorage.getItem("panda_user_name");
        if (username) {
            ApiEngine.post("/chat", {
                prompt: `/memorize ${key}=${value}`,
                user: username
            }).catch(err => console.error("Cloud memory sync failed:", err));
        }
    },

    /**
     * Mengambil fakta memori berdasarkan kunci
     * @param {string} key - Kunci informasi yang ingin dicari
     * @returns {string|null}
     */
    get(key) {
        return this.localContext[key] || localStorage.getItem(`panda_mem_${key}`);
    },

    /**
     * Membersihkan seluruh ingatan lokal (digunakan saat command /cls atau reset account)
     */
    clearAll() {
        this.localContext = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("panda_mem_")) {
                localStorage.removeItem(key);
            }
        });
    }
};
