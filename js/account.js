/**
 * PANDA ASSISTANT - Account & Password Manager Module
 * Mengelola enkripsi, autentikasi admin PIN, dan penyimpanan akun lokal/remote.
 */
const AccountEngine = {
    // Menyimpan status sesi admin yang berhasil diverifikasi (sementara)
    isAdminVerified: false,
    sessionTimeout: null,

    /**
     * Meminta PIN admin dari pengguna untuk membuka akses data sensitif
     * @param {string} serviceName - Nama layanan (contoh: GitHub, Dapodik)
     */
    async requestPasswordAccess(serviceName) {
        const pin = prompt(`[SECURITY] Masukkan 6-Digit PIN Admin Anda untuk mengakses password ${serviceName}:`);
        
        if (!pin) {
            ChatEngine.appendMessage("Assistant", "Akses dibatalkan. PIN diperlukan untuk membuka data terenkripsi.");
            return;
        }

        TypingEngine.show();
        try {
            // Mengirim PIN dan nama layanan ke backend untuk divalidasi dan didekripsi via AES
            const response = await ApiEngine.post("/chat", {
                prompt: `/password ${serviceName.toLowerCase()} ${pin}`,
                user: localStorage.getItem("panda_user_name")
            });
            
            TypingEngine.hide();
            if (response.success) {
                this.isAdminVerified = true;
                ChatEngine.appendMessage("Assistant", `<b>Kredensial Ditemukan untuk ${serviceName}:</b><br>${response.data.reply}`);
                this.startAdminSessionTimeout();
            } else {
                ChatEngine.appendMessage("Assistant", "⚠️ PIN Salah! Akses ditolak dan aktivitas ini telah dicatat di log sistem.");
            }
        } catch (error) {
            TypingEngine.hide();
            ChatEngine.appendMessage("Assistant", "Terjadi kesalahan koneksi saat mendekripsi data.");
        }
    },

    /**
     * Mengunci kembali status admin secara otomatis setelah 2 menit demi keamanan
     */
    startAdminSessionTimeout() {
        if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
        this.sessionTimeout = setTimeout(() => {
            this.isAdminVerified = false;
            console.log("[Security] Admin session expired. Lock re-applied.");
        }, 120000); // 2 Menit timeout
    }
};
