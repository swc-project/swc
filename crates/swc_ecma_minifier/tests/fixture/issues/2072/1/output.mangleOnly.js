function a(a, b) {
    if (b.val === a.val) {
        return 0;
    }
    if (typeof a.val === "object" && typeof b.val === "object") {
        if (a.key === undefined || b.key === undefined) {
            return 1;
        }
        if (a.key === b.key) {
            return 0;
        }
    }
    return 1;
}
