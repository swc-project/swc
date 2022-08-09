function e(e, r) {
    if (r.val === e.val) {
        return 0;
    }
    if (typeof e.val === "object" && typeof r.val === "object") {
        if (e.key === undefined || r.key === undefined) {
            return 1;
        }
        if (e.key === r.key) {
            return 0;
        }
    }
    return 1;
}
