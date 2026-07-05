const AnalyticsEngine = {
    trackSession() {
        const data = {
            browser: navigator.userAgent,
            resolution: `${window.innerWidth}x${window.innerHeight}`,
            os: navigator.platform
        };
        // Mengirim data analitik secara background pasif ke GAS
        navigator.sendBeacon ? navigator.sendBeacon(ApiEngine.baseUrl + "?endpoint=/analytics", JSON.stringify(data)) : null;
    }
};
