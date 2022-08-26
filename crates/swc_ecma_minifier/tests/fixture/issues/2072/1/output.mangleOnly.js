function e(e, t) {
    if (t.val === e.val) {
        return 0;
    }
    if (typeof e.val === "object" && typeof t.val === "object") {
        if (e.key === undefined || t.key === undefined) {
            return 1;
        }
        if (e.key === t.key) {
            return 0;
        }
    }
    return 1;
}
