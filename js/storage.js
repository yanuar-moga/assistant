const StorageEngine = {
    init() {
        if(!localStorage.getItem("panda_uuid")) {
            localStorage.setItem("panda_uuid", "USR-" + Math.floor(Math.random() * 900000 + 100000));
        }
    }
};
