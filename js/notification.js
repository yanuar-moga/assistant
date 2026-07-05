/**
 * PANDA ASSISTANT - Notification & Broadcast Module
 * Menangani penayangan tips, update sistem, dan notifikasi otomatis.
 */
const NotificationEngine = {
    lastChecked: null,

    /**
     * Memeriksa jadwal notifikasi atau pengumuman baru dari Spreadsheet
     */
    async checkSchedule() {
        const now = new Date();
        // Cegah spam request, hanya cek setiap 30 menit sekali saat aplikasi terbuka
        if (this.lastChecked && (now - this.lastChecked) < 1800000) return;
        this.lastChecked = now;

        try {
            // Meminta payload notifikasi aktif dari backend
            const response = await ApiEngine.post("/chat", {
                prompt: "/get_active_notifications",
                user: localStorage.getItem("panda_user_name")
            });

            if (response.success && response.data.notifications) {
                this.queueNotifications(response.data.notifications);
            }
        } catch (e) {
            console.warn("NotificationEngine failed to fetch context updates: ", e);
        }
    },

    /**
     * Memasukkan notifikasi ke dalam antrean obrolan dengan jeda waktu yang natural
     * @param {Array} list - Daftar notifikasi dari spreadsheet
     */
    queueNotifications(list) {
        list.forEach((notif, index) => {
            setTimeout(() => {
                const badge = notif.type === "Update" ? "📢 UPDATE:" : "💡 TIPS:";
                ChatEngine.appendMessage("Assistant", `<b>${badge} ${notif.title}</b><br>${notif.message}`);
                Utils.playSound("notification");
            }, (index + 1) * 5000); // Muncul bergantian setiap 5 detik setelah load
        });
    }
};
