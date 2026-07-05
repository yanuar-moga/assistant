/**
 * PANDA ASSISTANT - Utility Utilities Module
 * Menyediakan fungsi pembantu (helper) global untuk manipulasi DOM, audio, dan string.
 */
const Utils = {
    // Mengatur status global suara (ON/OFF) sesuai preferensi Config spreadsheet
    isSoundEnabled: true,

    /**
     * Memainkan efek suara berdasarkan jenis aksi aplikasi
     * @param {string} type - Jenis suara ('send' | 'receive' | 'notification')
     */
    playSound(type) {
        if (!this.isSoundEnabled) return;
        
        let audioSrc = "";
        switch (type) {
            case "send":
                audioSrc = "assets/sounds/send.mp3";
                break;
            case "receive":
                audioSrc = "assets/sounds/receive.mp3";
                break;
            case "notification":
                audioSrc = "assets/sounds/notification.mp3";
                break;
            default:
                return;
        }

        const audio = new Audio(audioSrc);
        audio.play().catch(err => console.log("Audio playback blocked by browser security policy. Wait for user gesture."));
    },

    /**
     * Mengubah teks string mentah agar aman dari serangan XSS sebelum di-render ke HTML
     * @param {string} rawString - Teks input dari user/external API
     * @returns {string} Teks yang sudah disanitasi
     */
    sanitizeHTML(rawString) {
        const temp = document.createElement("div");
        temp.textContent = rawString;
        return temp.innerHTML;
    },

    /**
     * Memformat objek tanggal menjadi format jam menit standar Indonesia (HH:MM)
     * @param {Date} dateObj - Objek Date JavaScript
     * @returns {string} Waktu terformat
     */
    formatTime(dateObj) {
        return dateObj.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    },

    /**
     * Mengubah status pengaturan audio secara dinamis
     * @param {boolean} status - True untuk menyalakan, False untuk membungkam
     */
    toggleSound(status) {
        this.isSoundEnabled = status;
        console.log(`[System Sound] Set to: ${status ? "ON" : "OFF"}`);
    }
};
