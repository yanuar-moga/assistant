// Mengatur Inisialisasi Aplikasi Utama
document.addEventListener("DOMContentLoaded", () => {
    StorageEngine.init();
    ThemeEngine.apply();
    AssistantEngine.init();
    ChatEngine.init();
    AnalyticsEngine.trackSession();
    NotificationEngine.checkSchedule();
});
