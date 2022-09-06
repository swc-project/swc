function e(e, n) {
    if (n.val === e.val) {
        return 0;
    }
    if (typeof e.val === "object" && typeof n.val === "object") {
        if (e.key === undefined || n.key === undefined) {
            return 1;
        }
        if (e.key === n.key) {
            return 0;
        }
    }
    return 1;
}
